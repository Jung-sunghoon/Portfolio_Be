const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

console.log("call swagger-gen");
const options = {
  info: {
    title: "Jsh's Portfolio",
    description: "API document",
  },
  servers: [
    {
      url: "/",
    },
  ],
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = "./api-spec/swagger-output.json";
const endpointsFiles = ["./routes/apis/**/*.js"];
swaggerAutogen(outputFile, endpointsFiles, options);
