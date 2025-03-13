
describe('GET /events', () => {
  it('should return all events', async () => {
    const res = await request(app).get('/events');
    expect(res.body).toEqual(events);
  });

  it('should return events filtered by category', async () => {
    const res = await request(app).get('/events?category=category1');
    expect(res.body).toEqual(events.filter(event => event.category === 'category1'));
  });

  it('should return events filtered by reminder', async () => {
    const res = await request(app).get('/events?reminder=true');
    expect(res.body).toEqual(events.filter(event => event.reminders.find(reminder => reminder.time < Date.now())));
  });
});
