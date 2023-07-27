import{_ as s,o as a,c as n,a as l}from"./app.89fdc23f.js";const C=JSON.parse('{"title":"Режимы приложений","description":"","frontmatter":{},"headers":[{"level":2,"title":"SSR","slug":"ssr","link":"#ssr","children":[]},{"level":2,"title":"SPA","slug":"spa","link":"#spa","children":[]},{"level":2,"title":"Индикатор загрузки SPA","slug":"индикатор-загрузки-spa","link":"#индикатор-загрузки-spa","children":[]}],"relativePath":"guide/modes.md"}'),p={name:"guide/modes.md"},o=l(`<h1 id="режимы-приложении" tabindex="-1">Режимы приложений <a class="header-anchor" href="#режимы-приложении" aria-hidden="true">#</a></h1><h2 id="ssr" tabindex="-1">SSR <a class="header-anchor" href="#ssr" aria-hidden="true">#</a></h2><p><strong>flue3</strong> по умолчанию работает в режиме <strong>SSR</strong>. Это означает, что некоторые данные и разметка страницы будут подготовлены на сервере и браузеру придёт размеченный <code>HTML</code>, где уже на клиенте (браузере) будет происходить гидрация результатов рендера в интерактивное приложение. <a href="https://vuejs.org/guide/scaling-up/ssr.html" target="_blank" rel="noreferrer">Подробнее</a></p><h2 id="spa" tabindex="-1">SPA <a class="header-anchor" href="#spa" aria-hidden="true">#</a></h2><p>Но так же <strong>flue3</strong> может работать и в режиме обычного <strong>SPA</strong>, если в файле конфигурации указать <code>ssr: false</code>.</p><p><code>flue3.config.ts</code></p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">defineConfig</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">flue3</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineConfig</span><span style="color:#A6ACCD;">((</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">ssr</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">);</span></span>
<span class="line"></span></code></pre></div><p>Таким образои всё выполнение кода будет происходить только в браузере.</p><h2 id="индикатор-загрузки-spa" tabindex="-1">Индикатор загрузки SPA <a class="header-anchor" href="#индикатор-загрузки-spa" aria-hidden="true">#</a></h2><p>В режиме <strong>SSR</strong> прежде чем браузеру отобразить страницу, он будет ждать выполнение кода на сервере и уже получить готовый <code>HTML</code>. Но в режиме <strong>SPA</strong> мы выполняем все на клиенте, поэтому перед отрисовкой приложения мы будем видить белый экран.</p><p>В <strong>flue3</strong> можно создать простой <code>.html</code> шаблон, который будет отображаться перед первой отрисовкой приложения, например индикатор загрузки.</p><p><code>flue3.config.ts</code></p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">defineConfig</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">flue3</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineConfig</span><span style="color:#A6ACCD;">((</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">loadingTemplateFilename</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">loading.html</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">);</span></span>
<span class="line"></span></code></pre></div><p><code>src/loading.html</code></p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">style</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">loading</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#B2CCD6;">color</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> red</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#B2CCD6;">text-align</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">style</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">loading</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    Загрузка...</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div>`,15),e=[o];function t(c,r,D,i,y,F){return a(),n("div",null,e)}const A=s(p,[["render",t]]);export{C as __pageData,A as default};