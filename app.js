'use strict';
(async () => {
  try {
    const response = await fetch('./event.json');
    if (!response.ok) throw new Error('Event data unavailable');
    const event = await response.json();
    document.querySelectorAll('[data-field]').forEach(el => { el.textContent = event[el.dataset.field] ?? ''; });
    for (const [id, value] of Object.entries({company: event.company, series: event.series, 'event-title': event.title, description: event.description, 'speaker-role': event.speaker.role, 'speaker-name': event.speaker.name, 'speaker-bio': event.speaker.bio})) {
      document.getElementById(id).textContent = value;
    }
    document.querySelectorAll('[data-sample]').forEach(el => { el.hidden = event.isSample !== true; });
    if (!event.applicationUrl && event.isSample !== true) document.getElementById('application-unavailable').textContent = '現在、お申し込みは受け付けていません';
    document.title = `${event.title.replace(/\n/g, '')} | ${event.company}`;
    for (const key of ['audience', 'notes']) {
      for (const value of event[key]) {
        const li = document.createElement('li');
        li.textContent = value;
        document.getElementById(key).append(li);
      }
    }
    for (const item of event.agenda) {
      const row = document.createElement('div'); row.className = 'agenda-item';
      const time = document.createElement('span'); time.className = 'agenda-time'; time.textContent = item.time;
      const body = document.createElement('div');
      const title = document.createElement('h3'); title.textContent = item.title;
      const detail = document.createElement('p'); detail.textContent = item.detail;
      body.append(title, detail); row.append(time, body); document.getElementById('agenda').append(row);
    }
    if (event.applicationUrl) {
      const url = new URL(event.applicationUrl);
      if (url.protocol !== 'https:') throw new Error('Application URL must use HTTPS');
      const link = document.getElementById('application-link'); link.href = url.href; link.hidden = false;
      document.getElementById('application-unavailable').hidden = true;
    }
    if (event.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.contactEmail)) {
      const link = document.getElementById('contact-link'); link.textContent = event.contactEmail; link.href = `mailto:${event.contactEmail}`; link.hidden = false;
      document.getElementById('contact-unavailable').hidden = true;
    }
    document.getElementById('year').textContent = new Date().getFullYear();
  } catch (error) {
    document.getElementById('load-error').hidden = false;
    document.getElementById('event-title').textContent = 'イベント情報を表示できません';
    console.error(error);
  }
})();
