import 'zone.js/node';

import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine} from '@angular/ssr';
import * as express from 'express';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import AppServerModule from './src/main.server';

import {createProxyMiddleware} from "http-proxy-middleware";
import 'localstorage-polyfill';
import fetch from 'node-fetch'

global['localStorage'] = localStorage;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/mi3s-fe/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use('/api', createProxyMiddleware({
    target: "http://127.0.0.1:8081/api",
    logger: console,
  }));

  function fetchApiData(url: string): Promise<any> {
    console.log('API fetchApiData:', url); // Log the API response data to console
    return new Promise((resolve, reject) => {
      var headers = {
        'X-API-KEY': '884500a4-24a3-4b76-a6b2-b268b7187e01'
      }
      fetch(url, {method: 'GET', headers: headers}).then(data => data.json()).then(res => {
        try {
          resolve(res);
        } catch (error) {
          reject(new Error('Error parsing response data'));
        }
      });
    });
  }

  server.get('*/tin-tuc/*', async (req, res, next) => {
    console.log('eq.url')
    console.log(req.url.split("/"))
    console.log(req.url.split("tin-tuc/")[1])
    const {protocol, originalUrl, baseUrl, headers} = req;
    try {
      console.log('Into TinTuc case')
      if (req.url.split("tin-tuc/")[1]) {
        commonEngine
          .render({
            bootstrap: AppServerModule,
            documentFilePath: indexHtml,
            url: `${protocol}://${headers.host}${originalUrl}`,
            publicPath: distFolder,
            providers: [{provide: APP_BASE_HREF, useValue: baseUrl}],
          })
          .then(async (html) => {
            console.log('Update MetaTag html: ')
            var urlRequest = "http://localhost:8081/api/v1/news/find?title="
            const apiData = await fetchApiData(urlRequest + req.url.split("tin-tuc/")[1]);
            if (html) {
              try {
                // Update HTML with parsed data
                // html = html.replace(/\$DESCRIPTION/g, apiData.content.split('.')[0]);
                // html = html.replace(/\$OG_META_DESCRIPTION/g, apiData.content.split('.')[0]);
                // html = html.replace(/\$OG_DESCRIPTION/g, apiData.content.split('.')[0]);
                if (apiData) {
                  let newContent = "";
                  const match = apiData?.content.match(/<p[^>]*>(.*?)<\/p>/i)
                  if(match[1]){
                    newContent = match[1].replace(/<\/?[^>]+(>|$)/g, "")
                  }
                  html = html.replace(/\$TITLE/g, apiData?.title);
                  html = html.replace(/\$OG_TITLE/g, apiData?.title);
                  html = html.replace(/\$OG_IMAGE/g, apiData?.image_info?.path);
                  html = html.replace(/\$OG_DESCRIPTION/g, newContent);
                  html = html.replace(/\$DESCRIPTION/g, newContent);
                } else {
                  html = html.replace(/\$TITLE/g, 'Mi3s - VietNam');
                  html = html.replace(/\$OG_TITLE/g, 'Mi3s - VietNam');
                  html = html.replace(/\$OG_DESCRIPTION/g, 'Hotline Store QN: 0919.213.678 - Hotline Store HCM: 0949.769.222');
                  html = html.replace(/\$DESCRIPTION/g, 'Hotline Store QN: 0919.213.678 - Hotline Store HCM: 0949.769.222');
                  html = html.replace(/\$OG_IMAGE/g, "http://localhost:4000/assets/icon/Xiaomi_logo.png");
                }

                // Send the updated HTML
                res.send(html);
              } catch (e) {
                console.error('Error updating HTML with API data:', e);
                res.status(500).send('Error updating HTML with API data');
              }
            } else {
              res.status(404).send('Page not found');
            }
          })
          .catch((err) => next(err));
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
      res.status(500).send('Error fetching API data');
    }
  });


  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));
  // // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const {protocol, originalUrl, baseUrl, headers} = req;
    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [{provide: APP_BASE_HREF, useValue: baseUrl}],
      })
      .then((html) => {
        console.log("Update normal tag")
        html = html.replace(/\$TITLE/g, 'Mi3s - Xiaomi Store Vietnam');
        html = html.replace(/\$OG_TITLE/g, 'Mi3s - Xiaomi Store Vietnam');
        html = html.replace(/\$OG_DESCRIPTION/g, 'Hotline Store QN: 0919.213.678 - Hotline Store HCM: 0949.769.222');
        html = html.replace(/\$DESCRIPTION/g, 'Hotline Store QN: 0919.213.678 - Hotline Store HCM: 0949.769.222');
        html = html.replace(/\$OG_IMAGE/g, "https://mi3s.vn/assets/icon/Xiaomi_logo.png");
        // Send the updated HTML
        res.send(html);
      })
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default AppServerModule;
