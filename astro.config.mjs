import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://ipheion712.github.io',
  base: '/AlbusMachinerySaccExtensions-Docs',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'ALBUS MACHINERY',
      description: 'SaccFlightAndVehicles 用 AMSE アドオンの導入・設定マニュアル。',
      defaultLocale: 'root',
      locales: { root: { label: '日本語', lang: 'ja' } },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/ipheion712/AlbusMachinerySaccExtensions-Docs' },
      ],
      favicon: '/favicon.svg',
      disable404Route: true,
      customCss: ['./src/styles/custom.css'],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        { label: 'アドオン一覧', slug: 'addons' },
        { label: 'はじめに', items: [
          { label: '対応環境', slug: 'getting-started/requirements' },
          { label: '共通の導入手順', slug: 'getting-started/installation' },
          { label: 'SaccEntity・DFUNC の登録', slug: 'getting-started/registration' },
          { label: 'よくある問題', slug: 'getting-started/troubleshooting' },
        ] },
        { label: '計器', items: [
          { label: 'AMSE_BallAIController', slug: 'addons/ball-ai' },
          { label: 'AMSE_RadarAltimeterController', slug: 'addons/radar-altimeter' },
          { label: 'AMSE_LoadGaugeController', slug: 'addons/load-gauge' },
          { label: 'AMSE_FlightInstruments_TypeA', slug: 'addons/flight-instruments' },
        ] },
        { label: 'エンジン・飛行挙動', items: [
          { label: 'AMSE_RotorStall', slug: 'addons/rotor-stall' },
          { label: 'AMSE_HeliGroundCyclic', slug: 'addons/heli-ground-cyclic' },
          { label: 'AMSE_EngineStartupRespawnReset', slug: 'addons/engine-startup-reset' },
        ] },
        { label: '音・視界・表示', items: [
          { label: 'AMSE_SoundController', slug: 'addons/sound-controller' },
          { label: 'AMSE_SightView', slug: 'addons/sight-view' },
          { label: 'AMSE_AnimatorParameterRelay', slug: 'addons/animator-relay' },
        ] },
        { label: '組み合わせ例', slug: 'examples/helicopter' },
        { label: '更新・移行', slug: 'changelog' },
        { label: 'ライセンス・配布について', slug: 'reference/licenses' },
      ],
    }),
  ],
});
