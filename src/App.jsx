import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudyPlan from './components/StudyPlan';
import TopicBacklog from './components/TopicBacklog';
import ResourceLibrary from './components/ResourceLibrary';
import AddTopicModal from './components/AddTopicModal';
import AddWeekModal from './components/AddWeekModal';
import SettingsModal from './components/SettingsModal';
import LessonReaderPage from './components/LessonReaderPage';
import CrawledBacklog from './components/CrawledBacklog';
import Profile from './components/Profile';
import JobsBoard from './components/JobsBoard';

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
  triggerCrawler,
  fetchProfileStats
} from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('paperwhite');

  // App State
  const [stats, setStats] = useState(null);
  const [digest, setDigest] = useState([]);
  const [phases, setPhases] = useState([]);
  const [groupedTopics, setGroupedTopics] = useState({ now: [], next: [], someday: [] });
  const [libraryData, setLibraryData] = useState({ items: [], availableTopics: [], availableSkillsets: [] });
  const [crawledBacklogData, setCrawledBacklogData] = useState({ items: [], availableTopics: [], availableSkillsets: [] });
  const [profileStats, setProfileStats] = useState(null);

  // Reader Modal State
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Modals State
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
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'paperwhite';
      return 'dark';
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all initial data
  const loadAllData = async () => {
    try {
      const [statsRes, digestRes, planRes, topicsRes, libRes, crawledRes, profileRes] = await Promise.all([
        fetchStats(),
        fetchDigest(),
        fetchPlan(),
        fetchTopics(),
        fetchLibrary(),
        fetchLibrary({ status: 'all' }),
        fetchProfileStats()
      ]);

      setStats(statsRes);
      setDigest(digestRes.digest || []);
      setPhases(planRes.phases || []);
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      setLibraryData(libRes);
      setCrawledBacklogData(crawledRes);
      setProfileStats(profileRes);
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('Error connecting to local server');
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- OPEN IN-APP LESSON READER ---
  const handleOpenReader = (item) => {
    if (!item) return;

    let contentBody = item.content_body;
    let template = item.actionable_template;
    let takeaways = item.key_takeaways;
    let youtubeVideos = item.youtube_videos;

    // If item is a backlog topic without content_body, try to find matching crawled resource
    if (!contentBody) {
      const match = libraryData.items?.find(r => r.topic_id === item.id || r.topic_title === item.title) ||
                    digest.find(d => d.topic_id === item.id || d.topic_title === item.title);
      if (match) {
        contentBody = match.content_body;
        template = match.actionable_template;
        takeaways = match.key_takeaways;
        youtubeVideos = match.youtube_videos;
      }
    }

    // Normalizing between crawled_resources, seed_resources, weeks, and backlog topics
    const normalizedLesson = {
      id: item.id,
      title: item.title,
      summary: item.summary || item.learning_goal || item.description || '',
      content_body: contentBody || '',
      key_takeaways: takeaways || [],
      actionable_template: template || '',
      youtube_videos: youtubeVideos || '[]',
      skillset: item.skillset || 'Program Management',
      skillset_priority: item.skillset_priority || (item.priority === 'high' ? 'P0 - Core TPM Discipline' : 'P1 - High-Value Differentiator'),
      read_time: item.read_time || '10 min read',
      personal_notes: item.personal_notes || item.notes || '',
      status: item.status || (item.completed ? 'read' : 'pending'),
      isWeek: Boolean(item.week_number)
    };

    setSelectedLesson(normalizedLesson);
    setIsReaderOpen(true);
    if (theme !== 'paperwhite') {
      setTheme('paperwhite');
    }
  };

  // --- CRAWLER TRIGGER ---
  const handleTriggerCrawl = async () => {
    setIsCrawling(true);
    try {
      const res = await triggerCrawler();
      showToast(`In-app lesson synthesis complete: ${res.count} fresh lessons ready!`);
      const [dig, st] = await Promise.all([fetchDigest(), fetchStats()]);
      setDigest(dig.digest || []);
      setStats(st);
    } catch (err) {
      console.error(err);
      showToast('Synthesis encountered an issue');
    } finally {
      setIsCrawling(false);
    }
  };

  // --- DIGEST ACTIONS ---
  const handleSaveDigest = async (id) => {
    try {
      await saveDigestItem(id);
      setDigest(prev => prev.filter(item => item.id !== id));
      const [lib, st, prof] = await Promise.all([fetchLibrary(), fetchStats(), fetchProfileStats()]);
      setLibraryData(lib);
      setStats(st);
      setProfileStats(prof);
      showToast('Saved to your In-App Knowledge Library!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadDigest = async (id) => {
    try {
      await markDigestItemRead(id);
      setDigest(prev => prev.filter(item => item.id !== id));
      const [lib, st, prof] = await Promise.all([fetchLibrary(), fetchStats(), fetchProfileStats()]);
      setLibraryData(lib);
      setStats(st);
      setProfileStats(prof);
      showToast('Lesson completed! Daily streak updated.');
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
      const [planRes, statsRes, profRes] = await Promise.all([fetchPlan(), fetchStats(), fetchProfileStats()]);
      setPhases(planRes.phases || []);
      setStats(statsRes);
      setProfileStats(profRes);
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
      const [planRes, topicsRes, statsRes, profRes] = await Promise.all([fetchPlan(), fetchTopics(), fetchStats(), fetchProfileStats()]);
      setPhases(planRes.phases || []);
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      setStats(statsRes);
      setProfileStats(profRes);
      showToast('Custom week added to curriculum');
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
      description: 'Quick-added topic for in-app daily lesson synthesis',
      skillset: 'Technical Architecture',
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
      await deleteTopic(id, false);
      const topicsRes = await fetchTopics();
      setGroupedTopics(topicsRes.grouped || { now: [], next: [], someday: [] });
      showToast('Topic archived and excluded from future lessons');
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

  const handleFilterCrawledBacklog = async (filters) => {
    try {
      const data = await fetchLibrary({ ...filters, status: 'all' });
      setCrawledBacklogData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLibraryNotes = async (id, notes) => {
    try {
      await updateLibraryNotes(id, notes);
      const lib = await fetchLibrary();
      setLibraryData(lib);
      showToast('Personal takeaways saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLibraryRead = async (id) => {
    try {
      await toggleLibraryRead(id);
      const [lib, st, prof] = await Promise.all([fetchLibrary(), fetchStats(), fetchProfileStats()]);
      setLibraryData(lib);
      setStats(st);
      setProfileStats(prof);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveLibraryItem = async (id) => {
    try {
      await removeLibraryItem(id);
      const [lib, st, prof] = await Promise.all([fetchLibrary(), fetchStats(), fetchProfileStats()]);
      setLibraryData(lib);
      setStats(st);
      setProfileStats(prof);
      showToast('Removed from library');
    } catch (err) {
      console.error(err);
    }
  };

  if (isReaderOpen && selectedLesson) {
    return (
      <LessonReaderPage 
        lesson={selectedLesson}
        onBack={() => setIsReaderOpen(false)}
        onSave={!selectedLesson.isWeek ? (id) => handleSaveDigest(id) : null}
        onMarkRead={(id) => {
          if (selectedLesson.isWeek) {
            handleToggleWeekComplete(id, true);
          } else {
            handleReadDigest(id);
          }
          setIsReaderOpen(false);
        }}
        onSaveNotes={(id, notes) => {
          if (selectedLesson.isWeek) {
            handleUpdateWeekNotes(id, notes);
          } else {
            handleUpdateLibraryNotes(id, notes);
          }
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

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
            onOpenReader={handleOpenReader}
          />
        )}

        {currentTab === 'plan' && (
          <StudyPlan 
            phases={phases}
            onToggleWeekComplete={handleToggleWeekComplete}
            onReorderWeeks={handleReorderWeeks}
            onOpenAddWeekModal={() => setIsAddWeekOpen(true)}
            onUpdateWeekNotes={handleUpdateWeekNotes}
            onOpenReader={handleOpenReader}
          />
        )}

        {currentTab === 'backlog' && (
          <TopicBacklog 
            groupedTopics={groupedTopics}
            digest={digest}
            libraryItems={libraryData.items}
            onMoveTopic={handleMoveTopic}
            onDeleteTopic={handleDeleteTopic}
            onOpenAddModal={() => setIsAddTopicOpen(true)}
            onOpenReader={handleOpenReader}
          />
        )}

        {currentTab === 'library' && (
          <ResourceLibrary 
            items={libraryData.items || []}
            availableTopics={libraryData.availableTopics || []}
            availableSkillsets={libraryData.availableSkillsets || []}
            onFilterChange={handleFilterLibrary}
            onUpdateNotes={handleUpdateLibraryNotes}
            onToggleRead={handleToggleLibraryRead}
            onRemoveItem={handleRemoveLibraryItem}
            onOpenReader={handleOpenReader}
          />
        )}

        {currentTab === 'crawled_backlog' && (
          <CrawledBacklog 
            items={crawledBacklogData.items || []}
            availableTopics={crawledBacklogData.availableTopics || []}
            availableSkillsets={crawledBacklogData.availableSkillsets || []}
            onFilterChange={handleFilterCrawledBacklog}
            onUpdateNotes={(id, notes) => {
              // Share library update logic since it hits the same DB table
              handleUpdateLibraryNotes(id, notes).then(() => {
                fetchLibrary({ status: 'all' }).then(setCrawledBacklogData);
              });
            }}
            onToggleRead={(id) => {
              handleToggleLibraryRead(id).then(() => {
                fetchLibrary({ status: 'all' }).then(setCrawledBacklogData);
              });
            }}
            onOpenReader={handleOpenReader}
          />
        )}

        {currentTab === 'profile' && (
          <Profile 
            profileStats={profileStats}
            onOpenReader={handleOpenReader}
          />
        )}

        {currentTab === 'jobs' && <JobsBoard />}
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
