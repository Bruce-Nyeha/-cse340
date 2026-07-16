app.get('/projects', async (req, res) => {
  const projects = await getAllProjects();
  // console.log('projects:', projects); // Log the retrieved projects for debugging
  const title = 'Projects';
  res.render('projects', { title, projects });
});
