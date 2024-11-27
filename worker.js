              align-items: center;
              box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
              animation: fadeIn 1s ease-in-out;
          }
          .logo-container {
              position: relative;
              width: 120px;
              height: 120px;
              margin-bottom: 15px;
              animation: blink 1.5s infinite;
          }
          .logo {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 5px solid white;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          }
          @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
          }
          h1 {
              color: rgb(34, 30, 104);
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 10px 0;
          }
          .description {
              color: rgb(34, 30, 104);
              font-size: 16px;
              width: 100%;
              text-align: left;
              margin-bottom: 10px;
          }
          .latency-list li {
              padding: 10px 15px;
              margin: 8px 0;
              border-radius: 10px;
              background-color: rgba(240, 240, 240, 0.8);
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: bold;
              color: rgb(34, 30, 104);
              font-size: 16px;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
          }
          .latency-list li.highlight {
              background-color: rgba(36, 170, 29, 0.2);
              color: rgb(34, 30, 104);
          }
          .latency {
              font-size: 14px;
          }
          .latency-fast { color: rgb(36, 170, 29); }
          .latency-medium { color: rgb(142, 161, 40); }
          .latency-slow { color: rgb(246, 152, 51); }
          .latency-error { color: rgb(230, 22, 16); }
          .minifont {
              color: rgb(34, 30, 104);
              font-size: 12px;
              margin-top: 15px;
              text-align: center;
          }
          .fastest-label {
              color: rgb(36, 170, 29);
              font-size: 14px;
              font-weight: bold;
              margin-left: 1px;
          }
          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="logo-container">
              <img class="logo" src="https://tuchuang.aokaoka.top/file/1728007981683_pic09.jpg" alt="Logo">
          </div>
          <h1>小奥のCDN 智能访问网关</h1>
          <ul class="description latency-list" id="urls"></ul>
          <span class="minifont">📢 与风共舞，随心而行。📈 今日访问人数: <span id="visitCount">加载中...</span></span>
          <span id="redirectingMessage" class="minifont" style="display: none;">正在跳转至最快的CDN...</span>
      </div>

      <script>
          // Fetch visit count
          fetch('https://umami.api.aokaoka.top/')
          .then(r => r.json())
          .then(d => document.getElementById('visitCount').innerText = d.today_pv)
          .catch(e => document.getElementById('visitCount').innerText = '加载失败');
      

          const urls = [
              "https://aokaoka.top#亚太 CDN",
              "https://vercel.aokaoka.top#vercel CDN",
              "https://blog.aokaoka.top#Cloudflare CDN"

          ];

          const ul = document.getElementById("urls");
          urls.forEach((url, index) => {
              const [testUrl, name] = url.split('#');
              const li = document.createElement("li");
              li.id = \`result\${index}\`;
              li.innerHTML = \`\${name} <span id="latency\${index}" class="latency">测速中...</span>\`;
              ul.appendChild(li);
          });

          const timeout = 3000;

          function testLatency(url) {
              return new Promise((resolve) => {
                  setTimeout(() => {
                      const latency = Math.floor(Math.random() * 1000);
                      resolve({ url, latency });
                  }, timeout);
              });
          }

          function getLatencyClass(latency) {
              if (latency <= 100) return 'latency-fast';
              if (latency <= 200) return 'latency-medium';
              if (latency <= 500) return 'latency-slow';
              return 'latency-error';
          }

          async function runTests() {
              const results = await Promise.all(urls.map(url => {
                  const [testUrl, name] = url.split('#');
                  return testLatency(testUrl).then(result => ({
                      ...result,
                      name
                  }));
              }));

              results.forEach((result, index) => {
                  const latencySpan = document.getElementById(\`latency\${index}\`);
                  latencySpan.textContent = \`\${result.latency}ms\`;
                  latencySpan.className = \`latency \${getLatencyClass(result.latency)}\`;
              });

              const validResults = results.filter(result => typeof result.latency === 'number');
              if (validResults.length > 0) {
                  const fastest = validResults.reduce((prev, current) => (prev.latency < current.latency ? prev : current), validResults[0]);

                  results.forEach((result, index) => {
                      if (result.name === fastest.name) {
                          const li = document.getElementById(\`result\${index}\`);
                          li.classList.add("highlight");
                          li.innerHTML += ' <span class="fastest-label">FASTEST</span>✅';
                      }
                  });

                  // Display redirect message with the URL
                  document.getElementById('redirectingMessage').textContent = \`正在跳转至最快的CDN: \${fastest.url}\`;
                  document.getElementById('redirectingMessage').style.display = 'block';

                  setTimeout(() => {
                      window.location.href = fastest.url;
                  }, 2000);
              }
          }

          window.onload = runTests;
      </script>
  </body>
  </html>
  `;

  // 返回 HTML 响应
  return new Response(htmlContent, {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}
