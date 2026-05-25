import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'TypeScript for AI Engineers',
  tagline: 'Học TypeScript trọn vẹn cho data scientist, research scientist, AI engineer và solution architect',
  url: 'https://tuandung222.github.io',
  baseUrl: '/typescript-for-ai-engineers/',
  organizationName: 'tuandung222',
  projectName: 'typescript-for-ai-engineers',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  future: {
    v4: true,
    faster: true,
  },
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'noindex,nofollow,noarchive,nosnippet',
      },
    },
  ],
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
    localeConfigs: {
      vi: {label: 'Tiếng Việt', htmlLang: 'vi-VN'},
    },
  },
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+',
      crossorigin: 'anonymous',
    },
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/tuandung222/typescript-for-ai-engineers/edit/main/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          showLastUpdateTime: false,
          numberPrefixParser: false,
        },
        blog: false,
        sitemap: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'vi'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    navbar: {
      title: 'TypeScript for AI Engineers',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'lectureSidebar',
          position: 'left',
          label: 'Bài giảng',
        },
        {
          to: '/docs/04-docmost-case-study/01-architecture-map',
          label: 'Docmost Case Study',
          position: 'left',
        },
        {
          to: '/docs/resources/glossary',
          label: 'Thuật ngữ',
          position: 'left',
        },
        {
          href: 'https://github.com/tuandung222/typescript-for-ai-engineers',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Lộ trình',
          items: [
            {label: 'Tổng quan', to: '/docs/intro'},
            {label: 'Python sang TypeScript', to: '/docs/01-python-to-typescript/01-mental-model'},
            {label: 'Toolchain', to: '/docs/02-toolchain/01-install-build-run'},
            {label: 'Docmost', to: '/docs/04-docmost-case-study/01-architecture-map'},
            {label: 'Coding Standard', to: '/docs/05-coding-standards/01-conventions'},
          ],
        },
        {
          title: 'Tài nguyên',
          items: [
            {label: 'Syllabus', to: '/docs/resources/syllabus'},
            {label: 'Glossary', to: '/docs/resources/glossary'},
            {label: 'Checklist', to: '/docs/resources/checklist'},
          ],
        },
      ],
      copyright: `Bản quyền © ${new Date().getFullYear()} TypeScript for AI Engineers. Nội dung đang được biên soạn.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'typescript', 'tsx', 'yaml', 'python', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
