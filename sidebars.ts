import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  lectureSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Phần 0: Định hướng',
      link: {type: 'doc', id: '00-orientation/01-overview'},
      collapsed: false,
      items: ['00-orientation/01-overview'],
    },
    {
      type: 'category',
      label: 'Phần 1: Python sang TypeScript',
      link: {type: 'doc', id: '01-python-to-typescript/01-mental-model'},
      collapsed: false,
      items: [
        '01-python-to-typescript/01-mental-model',
        '01-python-to-typescript/02-type-system',
        '01-python-to-typescript/03-runtime-and-modules',
      ],
    },
    {
      type: 'category',
      label: 'Phần 2: Toolchain',
      link: {type: 'doc', id: '02-toolchain/01-install-build-run'},
      collapsed: false,
      items: [
        '02-toolchain/01-install-build-run',
        '02-toolchain/02-package-json-tsconfig',
        '02-toolchain/03-monorepo-pnpm-nx',
      ],
    },
    {
      type: 'category',
      label: 'Phần 3: Viết ứng dụng TypeScript',
      link: {type: 'doc', id: '03-application-patterns/01-frontend-react'},
      collapsed: false,
      items: [
        '03-application-patterns/01-frontend-react',
        '03-application-patterns/02-backend-nestjs',
        '03-application-patterns/03-data-validation-api-contracts',
      ],
    },
    {
      type: 'category',
      label: 'Phần 4: Case Study Docmost',
      link: {type: 'doc', id: '04-docmost-case-study/01-architecture-map'},
      collapsed: false,
      items: [
        '04-docmost-case-study/01-architecture-map',
        '04-docmost-case-study/02-install-build-run-docmost',
        '04-docmost-case-study/03-reading-server-code',
        '04-docmost-case-study/04-reading-client-code',
      ],
    },
    {
      type: 'category',
      label: 'Phần 5: Coding Standard và Project Convention',
      link: {type: 'doc', id: '05-coding-standards/01-conventions'},
      collapsed: false,
      items: [
        '05-coding-standards/01-conventions',
        '05-coding-standards/02-project-organization',
        '05-coding-standards/03-testing-lint-format',
      ],
    },
    {
      type: 'category',
      label: 'Phần 6: TypeScript cho AI Engineering',
      link: {type: 'doc', id: '06-ai-engineering/01-ai-system-patterns'},
      collapsed: false,
      items: [
        '06-ai-engineering/01-ai-system-patterns',
        '06-ai-engineering/02-architect-roadmap',
      ],
    },
    {
      type: 'category',
      label: 'Phần 7: Case Study Gemini CLI',
      link: {type: 'doc', id: '07-gemini-cli-case-study/01-architecture-map'},
      collapsed: false,
      items: [
        '07-gemini-cli-case-study/01-architecture-map',
        '07-gemini-cli-case-study/02-install-build-run',
        '07-gemini-cli-case-study/03-reading-core-agent-loop',
        '07-gemini-cli-case-study/04-tool-system-and-mcp',
        '07-gemini-cli-case-study/05-terminal-ui-react-ink',
        '07-gemini-cli-case-study/06-sdk-and-extension-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Tài nguyên',
      collapsed: true,
      items: [
        'resources/syllabus',
        'resources/glossary',
        'resources/checklist',
      ],
    },
  ],
};

export default sidebars;
