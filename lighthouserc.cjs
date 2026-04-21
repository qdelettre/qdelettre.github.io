const fs = require("node:fs");
const path = require("node:path");

function walkHtml(dir, base = dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walkHtml(full, base);
		if (entry.name.endsWith(".html")) return [path.relative(base, full)];
		return [];
	});
}

const urls = walkHtml("./dist")
	.filter((rel) => rel !== "404.html")
	.map((rel) => {
		if (rel === "index.html") return "http://localhost/";
		return `http://localhost/${rel.replace(/\/index\.html$/, "/")}`;
	});

module.exports = {
	ci: {
		collect: {
			staticDistDir: "./dist",
			numberOfRuns: 3,
			url: urls,
		},
		assert: {
			assertions: {
				"categories:performance": ["error", { minScore: 0.9 }],
				"categories:accessibility": ["error", { minScore: 1.0 }],
				"categories:best-practices": ["error", { minScore: 0.95 }],
				"categories:seo": ["error", { minScore: 0.95 }],
			},
		},
		upload: {
			target: "temporary-public-storage",
		},
	},
};
