import{_ as s,o as a,c as n,a as l}from"./app.89fdc23f.js";const y=JSON.parse('{"title":"Сборка и деплой","description":"","frontmatter":{},"headers":[{"level":2,"title":"SSR","slug":"ssr","link":"#ssr","children":[]},{"level":2,"title":"SPA","slug":"spa","link":"#spa","children":[]}],"relativePath":"guide/build-deploy.md"}'),e={name:"guide/build-deploy.md"},p=l(`<h1 id="сборка-и-деплои" tabindex="-1">Сборка и деплой <a class="header-anchor" href="#сборка-и-деплои" aria-hidden="true">#</a></h1><p>Для сборки приложения <strong>flue3</strong> предоставляет команду <code>build</code>.</p><p><code>package.json</code></p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">scripts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">build</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">flue3 build</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Результат сборки приложения будет хранится в директории <code>dist</code>. Имя этой директории можно поменять в файле конфигурации параметром <a href="/guide/config.html#outputpath">outputPath</a></p><h2 id="ssr" tabindex="-1">SSR <a class="header-anchor" href="#ssr" aria-hidden="true">#</a></h2><p>В режиме SSR результатом сборки будет две директории: <code>client</code> для клиентского окружения и <code>server</code> для серверного окружения.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">.</span></span>
<span class="line"><span style="color:#A6ACCD;">├─ dist</span></span>
<span class="line"><span style="color:#A6ACCD;">│  ├─ client</span></span>
<span class="line"><span style="color:#A6ACCD;">│  │  ├─ public</span></span>
<span class="line"><span style="color:#A6ACCD;">│  │  └─ ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│  ├─ server</span></span>
<span class="line"><span style="color:#A6ACCD;">│  │  ├─ server.mjs</span></span>
<span class="line"><span style="color:#A6ACCD;">│  │  └─ ...</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Все пакеты, которые были импортированы в серверный бандл (например из <code>node_modules</code>) будут в любом случае транспилированы и попадут в итоговый бандл, таким образом вам не нужно за собой тащить отдельно <code>node_modules</code> и приложение будет существовать самостоятельно.</p><p>Для запуска приложения, нужно выполнить <code>server.mjs</code> файл, который создаст HTTP сервер, будет принимать запросы и раздавать статику.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">node dist/server/server.mjs</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="spa" tabindex="-1">SPA <a class="header-anchor" href="#spa" aria-hidden="true">#</a></h2><p>В режиме SPA результатом сборки будет центральный <code>index.html</code> файл и директория со статикой <code>public</code>.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">.</span></span>
<span class="line"><span style="color:#A6ACCD;">├─ dist</span></span>
<span class="line"><span style="color:#A6ACCD;">│  ├─ public</span></span>
<span class="line"><span style="color:#A6ACCD;">│  └─ index.html</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Ваш HTTP сервер должен по корневому пути отдавать файлы из директории <code>public</code>. Но если статический файл не найден, то отдавать <code>index.html</code>, сохраняя текущий путь.</p>`,16),o=[p];function c(t,i,r,d,C,A){return a(),n("div",null,o)}const D=s(e,[["render",c]]);export{y as __pageData,D as default};