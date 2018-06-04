const app = require('./app');

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Overview module listening on port ${port}`));
