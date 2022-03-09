const { createService } = require("../src/quotes-service");
const app = createService();

app.listen(3000);
