const fs = require("fs");
const YAML = require("yamljs");
const { resolveRefs } = require("json-refs");

const swaggerFile = "./swagger.yaml";

// Read the Swagger specification file
const swaggerSpec = YAML.load(swaggerFile);

// Options for resolving JSON references
const options = {
  filter: ["relative"],
};

// Resolve JSON references
resolveRefs(swaggerSpec, options).then((results) => {
  const combinedSpec = results.resolved;
  const combinedYaml = YAML.stringify(combinedSpec, 10);
  fs.writeFileSync(swaggerFile, combinedYaml, "utf8");
  console.log("Swagger specification file is updated.");
});
