const API_BASE = '/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}

export async function fetchProfileStats() {
  const res = await fetch(`${API_BASE}/stats/profile`);
  if (!res.ok) throw new Error('Failed to load profile stats');
  return res.json();
}

export async function recordStudySession(minutes) {
  const res = await fetch(`${API_BASE}/stats/study-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes })
  });
  if (!res.ok) throw new Error('Failed to record session');
  return res.json();
}

export async function fetchPlan() {
  const res = await fetch(`${API_BASE}/plan`);
  if (!res.ok) throw new Error('Failed to load study plan');
  return res.json();
}

export async function updateWeek(weekId, updates) {
  const res = await fetch(`${API_BASE}/plan/weeks/${weekId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update week');
  return res.json();
}

export async function addCustomWeek(data) {
  const res = await fetch(`${API_BASE}/plan/weeks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to add custom week');
  return res.json();
}

export async function reorderWeeks(orderedIds) {
  const res = await fetch(`${API_BASE}/plan/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds })
  });
  if (!res.ok) throw new Error('Failed to reorder weeks');
  return res.json();
}

export async function fetchDigest() {
  const res = await fetch(`${API_BASE}/digest`);
  if (!res.ok) throw new Error('Failed to load daily digest');
  return res.json();
}

export async function saveDigestItem(id) {
  const res = await fetch(`${API_BASE}/digest/${id}/save`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to save item');
  return res.json();
}

export async function markDigestItemRead(id) {
  const res = await fetch(`${API_BASE}/digest/${id}/read`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to mark item read');
  return res.json();
}

export async function dismissDigestItem(id) {
  const res = await fetch(`${API_BASE}/digest/${id}/dismiss`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to dismiss item');
  return res.json();
}

export async function fetchTopics() {
  const res = await fetch(`${API_BASE}/topics`);
  if (!res.ok) throw new Error('Failed to load topics');
  return res.json();
}

export async function createTopic(topic) {
  const res = await fetch(`${API_BASE}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topic)
  });
  if (!res.ok) throw new Error('Failed to create topic');
  return res.json();
}

export async function updateTopic(id, updates) {
  const res = await fetch(`${API_BASE}/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update topic');
  return res.json();
}

export async function deleteTopic(id, hardDelete = false) {
  const res = await fetch(`${API_BASE}/topics/${id}?hardDelete=${hardDelete}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete topic');
  return res.json();
}

export async function fetchLibrary(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/library?${query}`);
  if (!res.ok) throw new Error('Failed to load library');
  return res.json();
}

export async function updateLibraryNotes(id, personal_notes) {
  const res = await fetch(`${API_BASE}/library/${id}/notes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personal_notes })
  });
  if (!res.ok) throw new Error('Failed to update notes');
  return res.json();
}

export async function toggleLibraryRead(id) {
  const res = await fetch(`${API_BASE}/library/${id}/toggle-read`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to toggle read status');
  return res.json();
}

export async function removeLibraryItem(id) {
  const res = await fetch(`${API_BASE}/library/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove item');
  return res.json();
}

export async function triggerCrawler() {
  const res = await fetch(`${API_BASE}/crawler/run`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger crawler');
  return res.json();
}

export async function fetchCrawlerStatus() {
  const res = await fetch(`${API_BASE}/crawler/status`);
  if (!res.ok) throw new Error('Failed to fetch crawler status');
  return res.json();
}

export async function fetchCrawlLogs() {
  const res = await fetch(`${API_BASE}/crawler/logs`);
  if (!res.ok) throw new Error('Failed to fetch crawler logs');
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to load settings');
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function fetchJobs() {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error('Failed to load jobs');
  return res.json();
}

export async function triggerJobFetch() {
  const res = await fetch(`${API_BASE}/jobs/fetch`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to fetch new jobs from APIs');
  return res.json();
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update job status');
  return res.json();
}
