const app = require('./application');

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Menu module listening on port ${port}`));
