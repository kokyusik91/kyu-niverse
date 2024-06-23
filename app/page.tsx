import ColorProvider from "./providers/ColorProvider";

import IloveSkillContainer from "./components/box-contents-container-server-components/IloveSkillContainer";
import ResumeContainer from "./components/box-contents-container-server-components/ResumeContainer";
import GithubBlogContainer from "./components/box-contents-container-server-components/GithubBlogContainer";
import FashionContainer from "./components/box-contents-container-server-components/FashionContainer";
import InterestContainer from "./components/box-contents-container-server-components/InterestContainer";
import MedicContainer from "./components/box-contents-container-server-components/MedicContainer";
import BookStoreContainer from "./components/box-contents-container-server-components/BookStoreContainer";
import BrunchContainer from "./components/box-contents-container-server-components/BrunchContainer";
import KofetchContainer from "./components/box-contents-container-server-components/KofetchContainer";
import FEworldContainer from "./components/box-contents-container-server-components/FEworldContainer";
import BEworldContainer from "./components/box-contents-container-server-components/BEworldContainer";
import EmptyContainer from "./components/box-contents-container-server-components/EmptyContainer";
import GithubContainer from "./components/box-contents-container-server-components/GithubContainer";
import ActivityContainer from "./components/box-contents-container-server-components/ActivityContainer";
import InfraContainer from "./components/box-contents-container-server-components/InfraContainer";
import ToggleColorButton from "./components/setting-buttons/ToggleColorButton";
import DescriptionButton from "./components/setting-buttons/DescriptionButton";
import DescriptionProvider from "./providers/DescriptionProvider";
import LinkButton from "./components/setting-buttons/LinkButton";
import {
  KYUNIVERSE_GITHUB_URL,
  KYUNIVERSE_NOTION_URL,
} from "./constants/external-url";

export default function Home() {
  return (
    <ColorProvider>
      <DescriptionProvider>
        <main className="flex min-h-screen flex-col items-center justify-between bg-black bg-auto bg-origin-content lg:bg-[url('/universe-2.jpg')] lg:p-5 2xl:p-12">
          <header className="flex items-center p-6 lg:p-0">
            <h1 className="poetsen mr-3 inline-block w-full animate-gradient bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-300% bg-clip-text text-center text-4xl font-extrabold text-transparent lg:text-6xl">
              KYU-NIVERSE
            </h1>
            <span className="text-3xl font-extrabold lg:text-5xl">🌍</span>
          </header>
          <nav className="my-3 flex w-full items-center justify-between px-5 lg:p-0">
            <div className="flex items-center gap-6">
              <LinkButton url={KYUNIVERSE_NOTION_URL} src="notion.svg" />
              <LinkButton url={KYUNIVERSE_GITHUB_URL} src="/github.svg" />
            </div>
            <div className="flex items-center gap-6">
              <DescriptionButton />
              <ToggleColorButton />
            </div>
          </nav>
          {/* 메인 컨텐츠 영역 */}
          <div className="w-full rounded-md p-5 lg:bg-slate-100">
            {/* 모바일 레이아웃 */}
            <div className="block w-full lg:hidden">
              <div className="flex flex-col gap-5">
                <ResumeContainer />
                <IloveSkillContainer />
                <GithubBlogContainer />
                {/* 모바일에서는 제외 시킴 */}
                {/* <FashionContainer /> */}
                <InterestContainer />
                <MedicContainer />
                <BookStoreContainer />
                <BrunchContainer />
                <KofetchContainer />
                <FEworldContainer />
                <BEworldContainer />
                <EmptyContainer />

                <GithubContainer />
                <InfraContainer />
                <ActivityContainer />
              </div>
            </div>
            {/* 데스크탑 레이아웃 */}
            <div className="hidden h-[1000px] w-full gap-5 bg-slate-100 lg:flex">
              <div className="flex h-full w-2/6 flex-col gap-5 bg-slate-100">
                <div className="flex w-full grow gap-5">
                  <div className="flex h-full w-2/5 flex-col gap-5 bg-slate-100">
                    <ResumeContainer />
                    <IloveSkillContainer />
                    <GithubBlogContainer />
                  </div>
                  <FashionContainer />
                </div>
                <InterestContainer />
              </div>
              <div className="flex grow flex-col gap-5 bg-slate-100">
                <div className="flex grow gap-5 bg-slate-100">
                  <MedicContainer />
                  <BookStoreContainer />
                  <div className="flex grow flex-col gap-5 bg-slate-100">
                    <BrunchContainer />
                    <KofetchContainer />
                  </div>
                </div>
                <div className="flex h-2/5 gap-5 bg-slate-100">
                  <FEworldContainer />
                  <BEworldContainer />
                  <EmptyContainer />
                </div>
                <div className="flex grow gap-5 bg-slate-100">
                  <GithubContainer />
                  <ActivityContainer />
                  <InfraContainer />
                </div>
              </div>
            </div>
          </div>
        </main>
      </DescriptionProvider>
    </ColorProvider>
  );
}
