import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const parts = [
  ['00', 'Định hướng', 'Vì sao TypeScript đáng học với data scientist và AI engineer.', '/docs/00-orientation/01-overview'],
  ['01', 'Python sang TypeScript', 'So sánh mental model, type system, runtime, module và async.', '/docs/01-python-to-typescript/01-mental-model'],
  ['02', 'Toolchain', 'Node, pnpm, npm scripts, tsconfig, build, dev server và monorepo.', '/docs/02-toolchain/01-install-build-run'],
  ['03', 'Ứng dụng', 'React frontend, NestJS backend, API contracts, validation và data flow.', '/docs/03-application-patterns/01-frontend-react'],
  ['04', 'Docmost Case Study', 'Đọc một TypeScript monorepo production: client, server, packages, Docker và services.', '/docs/04-docmost-case-study/01-architecture-map'],
  ['05', 'Coding Standard', 'Convention, project organization, testing, lint, format và code review checklist.', '/docs/05-coding-standards/01-conventions'],
  ['06', 'AI Engineering', 'TypeScript trong LLM apps, agent systems, tools, APIs và solution architecture.', '/docs/06-ai-engineering/01-ai-system-patterns'],
];

function HomepageHeader(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}>For data scientists, research scientists and AI engineers</p>
        <Heading as="h1" className={styles.heroTitle}>{siteConfig.title}</Heading>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <div className={styles.heroButtons}>
          <Link className={`button button--primary button--lg ${styles.heroButton}`} to="/docs/intro">Bắt đầu học</Link>
          <Link className={`button button--secondary button--lg ${styles.heroButton}`} to="/docs/04-docmost-case-study/01-architecture-map">Đọc case study Docmost</Link>
        </div>
      </div>
    </header>
  );
}

function PartGrid(): ReactNode {
  return (
    <section className={styles.gridSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Bảy phần học TypeScript qua dự án thật</Heading>
        <p className={styles.sectionSubtitle}>
          Lộ trình đi từ Python mental model tới TypeScript production: toolchain, architecture, coding convention, monorepo và AI engineering patterns.
        </p>
        <div className={styles.grid}>
          {parts.map(([number, title, description, to]) => (
            <Link key={number} to={to} className={styles.card}>
              <div className={styles.cardNumber}>PHẦN {number}</div>
              <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
              <p className={styles.cardDescription}>{description}</p>
              <span className={styles.badgeReady}>Đọc phần này</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophySection(): ReactNode {
  return (
    <section className={styles.philosophy}>
      <div className="container">
        <blockquote className={styles.quote}>
          <p><em>TypeScript không chỉ là JavaScript có kiểu. Nó là cách đưa hợp đồng dữ liệu, kiến trúc module và niềm tin khi refactor vào một codebase đang lớn lên.</em></p>
        </blockquote>
        <p className={styles.philosophyText}>
          Với người có nền Python, học TypeScript không khó nếu bạn tách rõ hai lớp: JavaScript runtime chạy thật và TypeScript type system kiểm tra trước khi chạy. Khi hiểu hai lớp này, bạn sẽ đọc được frontend, backend, SDK, agent tools và cả những monorepo production như Docmost một cách có hệ thống.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline as string}>
      <HomepageHeader />
      <main>
        <PartGrid />
        <PhilosophySection />
      </main>
    </Layout>
  );
}
