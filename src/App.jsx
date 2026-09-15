import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudyPlan from './components/StudyPlan';
import TopicBacklog from './components/TopicBacklog';
import ResourceLibrary from './components/ResourceLibrary';
import AddTopicModal from './components/AddTopicModal';
import AddWeekModal from './components/AddWeekModal';
import SettingsModal from './components/SettingsModal';

import {
  fetchStats,
  fetchPlan,
  fetchDigest,
  saveDigestItem,
  markDigestItemRead,
  dismissDigestItem,
  updateWeek,
  reorderWeeks,
  addCustomWeek,
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  fetchLibrary,
  updateLibraryNotes,
  toggleLibraryRead,
  removeLibraryItem,
  triggerCrawler
} from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  // App State
  const [stats, setStats] = useState(null);
  const [digest, setDigest] = useState([]);
  const [phases, setPhases] = useState([]);
  const [groupedTopics, setGroupedTopics] = useState({ now: [], next: [], someday: [] });
  const [libraryData, setLibraryData] = useState({ items: [], availableTopics: [], availableDomains: [] });

  // UI / Modal State
  const [isCrawling, setIsCrawling] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isAddWeekOpen, setIsAddWeekOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Set theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all initial data
  const loadAllData = async () => {
    try {
      const [statsRes, digestRes, planRes, topicsRes, libRes] = await Promise.all([
        fetchStats(),
        fetchDigest(),
        fetchPlan(),
        fetchTopics(),
        fetchLibrary()
      ]);

      setStats(statsRes);
      setDigest(digestRes.digest || []);
      setPhases(planRes.phases || []);
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      setLibraryData(libRes);
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('Error connecting to local server');
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- CRAWLER TRIGGER ---
  const handleTriggerCrawl = async () => {
    setIsCrawling(true);
    try {
      const res = await triggerCrawler();
      showToast(`Crawl complete: ${res.count} fresh resources discovered!`);
      // Reload digest & stats
      const [dig, st] = await Promise.all([fetchDigest(), fetchStats()]);
      setDigest(dig.digest || []);
      setStats(st);
    } catch (err) {
      console.error(err);
      showToast('Crawl encounter an issue');
    } finally {
      setIsCrawling(false);
    }
  };

  // --- DIGEST ACTIONS ---
  const handleSaveDigest = async (id) => {
    try {
      await saveDigestItem(id);
      setDigest(prev => prev.filter(item => item.id !== id));
      const [lib, st] = await Promise.all([fetchLibrary(), fetchStats()]);
      setLibraryData(lib);
      setStats(st);
      showToast('Saved to your Resource Library!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadDigest = async (id) => {
    try {
      await markDigestItemRead(id);
      setDigest(prev => prev.filter(item => item.id !== id));
      const [lib, st] = await Promise.all([fetchLibrary(), fetchStats()]);
      setLibraryData(lib);
      setStats(st);
      showToast('Marked as read! Streak updated.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissDigest = async (id) => {
    try {
      await dismissDigestItem(id);
      setDigest(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- STUDY PLAN ACTIONS ---
  const handleToggleWeekComplete = async (weekId, completed) => {
    try {
      await updateWeek(weekId, { completed });
      const [planRes, statsRes] = await Promise.all([fetchPlan(), fetchStats()]);
      setPhases(planRes.phases || []);
      setStats(statsRes);
      showToast(completed ? 'Week completed! Excellent progress.' : 'Week marked as in progress');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateWeekNotes = async (weekId, notes) => {
    try {
      await updateWeek(weekId, { notes });
      const planRes = await fetchPlan();
      setPhases(planRes.phases || []);
      showToast('Weekly reflection notes saved');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorderWeeks = async (orderedIds) => {
    try {
      await reorderWeeks(orderedIds);
      const planRes = await fetchPlan();
      setPhases(planRes.phases || []);
      showToast('Curriculum order updated');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddWeek = async (weekData) => {
    try {
      await addCustomWeek(weekData);
      const [planRes, topicsRes, statsRes] = await Promise.all([fetchPlan(), fetchTopics(), fetchStats()]);
      setPhases(planRes.phases || []);
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      setStats(statsRes);
      showToast('Custom week added to study plan');
    } catch (err) {
      console.error(err);
    }
  };

  // --- TOPIC ACTIONS ---
  const handleAddTopic = async (topicData) => {
    try {
      await createTopic(topicData);
      const topicsRes = await fetchTopics();
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      showToast(`Topic added to "${topicData.status.toUpperCase()}" queue`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAddTopic = async (title) => {
    await handleAddTopic({
      title,
      description: 'Quick-added topic for daily crawling',
      priority: 'high',
      status: 'now',
      tags: ['QuickAdd']
    });
  };

  const handleMoveTopic = async (id, newStatus) => {
    try {
      await updateTopic(id, { status: newStatus });
      const topicsRes = await fetchTopics();
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      showToast(`Topic moved to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTopic = async (id) => {
    try {
      await deleteTopic(id, false); // Archive
      const topicsRes = await fetchTopics();
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      showToast('Topic archived and removed from crawls');
    } catch (err) {
      console.error(err);
    }
  };

  // --- LIBRARY ACTIONS ---
  const handleFilterLibrary = async (filters) => {
    try {
      const data = await fetchLibrary(filters);
      setLibraryData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLibraryNotes = async (id, notes) => {
    try {
      await updateLibraryNotes(id, notes);
      const lib = await fetchLibrary();
      setLibraryData(lib);
      showToast('Takeaways saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLibraryRead = async (id) => {
    try {
      await toggleLibraryRead(id);
      const [lib, st] = await Promise.all([fetchLibrary(), fetchStats()]);
      setLibraryData(lib);
      setStats(st);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveLibraryItem = async (id) => {
    try {
      await removeLibraryItem(id);
      const [lib, st] = await Promise.all([fetchLibrary(), fetchStats()]);
      setLibraryData(lib);
      setStats(st);
      showToast('Removed from library');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        streakCount={stats?.currentStreak || 1}
        onQuickAddTopic={handleQuickAddTopic}
        onTriggerCrawl={handleTriggerCrawl}
        isCrawling={isCrawling}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        digestCount={digest.length}
      />

      <main className="app-container">
        {currentTab === 'dashboard' && (
          <Dashboard 
            stats={stats}
            digest={digest}
            currentWeek={stats?.currentWeek}
            onSaveDigest={handleSaveDigest}
            onReadDigest={handleReadDigest}
            onDismissDigest={handleDismissDigest}
            onToggleWeekComplete={handleToggleWeekComplete}
            onTriggerCrawl={handleTriggerCrawl}
            onSessionCompleted={() => {
              fetchStats().then(setStats);
              showToast('45-min study session logged! Keep the momentum.');
            }}
          />
        )}

        {currentTab === 'plan' && (
          <StudyPlan 
            phases={phases}
            onToggleWeekComplete={handleToggleWeekComplete}
            onReorderWeeks={handleReorderWeeks}
            onOpenAddWeekModal={() => setIsAddWeekOpen(true)}
            onUpdateWeekNotes={handleUpdateWeekNotes}
          />
        )}

        {currentTab === 'backlog' && (
          <TopicBacklog 
            groupedTopics={groupedTopics}
            onMoveTopic={handleMoveTopic}
            onDeleteTopic={handleDeleteTopic}
            onOpenAddModal={() => setIsAddTopicOpen(true)}
          />
        )}

        {currentTab === 'library' && (
          <ResourceLibrary 
            items={libraryData.items || []}
            availableTopics={libraryData.availableTopics || []}
            availableDomains={libraryData.availableDomains || []}
            onFilterChange={handleFilterLibrary}
            onUpdateNotes={handleUpdateLibraryNotes}
            onToggleRead={handleToggleLibraryRead}
            onRemoveItem={handleRemoveLibraryItem}
          />
        )}
      </main>

      {/* Modals */}
      <AddTopicModal 
        isOpen={isAddTopicOpen}
        onClose={() => setIsAddTopicOpen(false)}
        onAddTopic={handleAddTopic}
      />

      <AddWeekModal 
        isOpen={isAddWeekOpen}
        onClose={() => setIsAddWeekOpen(false)}
        phases={phases}
        onAddWeek={handleAddWeek}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onTriggerCrawl={handleTriggerCrawl}
        isCrawling={isCrawling}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
