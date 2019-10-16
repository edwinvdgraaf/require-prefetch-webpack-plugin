const NullDependency = require("webpack/lib/dependencies/NullDependency.js");

class PrefetchDependency extends NullDependency {
  constructor(compilation, expr) {
    super();
    this.compilation = compilation;
    this.arg = expr.arguments[0];
    this.range = expr.range;
  }
}

PrefetchDependency.Template = class PrefetchDependencyTemplate {
  apply(dep, source) {
    const prefetchedModule = dep.compilation.modules.find(x => x.rawRequest == dep.arg.value);
    
    if(!prefetchedModule) {
      dep.compilation.errors.push( new Error( 'Cannot find trlalala' ) ) 
      return;
    }
    
    const id = dep.compilation.chunkGroups.find(g => g.containsModule(prefetchedModule)).id;
    
    source.replace(dep.range[0], dep.range[1] - 1, `__webpack_require__.pf(${id});`);
  }
}

class RequirePrefetchPlugin {
  constructor(options) {
		this.options = options;
	}

	apply(compiler) {
    // Tap into the compilation to track down all 
    // `require.prefetch` calls.
    compiler.hooks.compilation.tap(
			"RequirePrefetchPlugin",
			(compilation, { contextModuleFactory, normalModuleFactory }) => {
      
        compilation.dependencyTemplates.set(
					PrefetchDependency,
					new PrefetchDependency.Template()
				);

        const handler = (parser) => {
          
          const process = (expr, weak) => {
            if (expr.arguments.length !== 1) return;
            // const param = parser.evaluateExpression(expr.arguments[0]);
            const dep = new PrefetchDependency(compilation, expr);
            dep.loc = expr.loc;
            parser.state.current.addDependency(dep);
            return true;
          };

          parser.hooks.call
          .for("require.prefetch")
          .tap("RequirePrefetchPlugin", expr => {
            return process(expr, true);
          });
        };
        
        normalModuleFactory.hooks.parser
        .for("javascript/auto")
        .tap("RequirePrefetchPlugin", handler);
      });


      compiler.hooks.thisCompilation.tap("RequirePrefetchPlugin", compilation => {
        compilation.mainTemplate.hooks.requireExtensions.tap(
          "RequirePrefetchPlugin",
          function(source) {
            const preFetchString = `

// Custom prefetch function - RequirePrefetchPlugin
__webpack_require__.pf = function(chunkId) {
  if(installedChunks[chunkId] === undefined) {
    installedChunks[chunkId] = null;
    var link = document.createElement('link');
    if (__webpack_require__.nc) {
      link.setAttribute("nonce", __webpack_require__.nc);
    }
    link.rel = "prefetch";
    link.as = "script";
    link.href = jsonpScriptSrc(chunkId);
    document.head.appendChild(link);
  }
}`;
            const newSource = source + preFetchString;
            return newSource;
          }
        );
      });
  }
}

module.exports = RequirePrefetchPlugin;