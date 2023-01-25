import{_ as s,c as a,o as n,a as e}from"./app.df5f6e1b.js";const A=JSON.parse('{"title":"Перенаправление навигации","description":"","frontmatter":{},"headers":[],"relativePath":"guide/redirect.md"}'),o={name:"guide/redirect.md"},l=e(`<h1 id="перенаправление-навигации" tabindex="-1">Перенаправление навигации <a class="header-anchor" href="#перенаправление-навигации" aria-hidden="true">#</a></h1><p>Если вам нужно сделать редирект на другой путь/сайт например в <code>middleware</code>, то можно воспользоваться методом <a href="/api/context.html#rediect">redirect</a> из контекста приложения.</p><p><code>src/middleware/isAuthMiddleware.ts</code>;</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">defineMiddleware</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">flue3</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> isAuthMiddleware </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineMiddleware</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">appContext</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">appContext</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">state</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">user</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">appContext</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">redirect</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/auth</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>Если этот код будет выполнен на сервере, то произойдёт <code>HTTP</code> редирект с заголовком <code>Location</code> и соответствующим <code>HTTP</code> кодом. На клиенте это будет <code>window.location.href</code>, но с плагином <a href="/guide/routing.html">роутинга</a>, этот метод будет вызывать <code>router.push</code>.</p>`,5),p=[l];function t(c,r,i,D,y,d){return n(),a("div",null,p)}const C=s(o,[["render",t]]);export{A as __pageData,C as default};
