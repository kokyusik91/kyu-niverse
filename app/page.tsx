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
import ToggleColorButton from "./components/ToggleColorButton";

export default function Home() {
  return (
    <ColorProvider>
      <main className="flex min-h-screen flex-col items-center justify-between bg-yellow-200 bg-[url('/universe-full.jpg')] bg-auto bg-center bg-origin-content p-12">
        <header className="flex items-center">
          <h1 className="poetsen mr-3 inline-block w-full bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-center text-6xl font-extrabold text-transparent bg-300% animate-gradient">
            KYU-NIVERSE
          </h1>
          <span className="text-5xl font-extrabold">🌍</span>
        </header>
        <div className="flex w-full text-left"></div>
        <div className="w-full text-right">
          <ToggleColorButton />
        </div>
        <div className="w-full rounded-md bg-white p-5">
          <div className="flex h-[1000px] 3xl:h-[1400px] w-full gap-5 bg-white">
            <div className="flex h-full w-2/6 flex-col gap-5 bg-white">
              <div className="flex w-full grow gap-5">
                <div className="flex h-full w-1/2 flex-col gap-5 bg-white">
                  <ResumeContainer />
                  <IloveSkillContainer />
                  <GithubBlogContainer />
                </div>
                <FashionContainer />
              </div>
              <InterestContainer />
            </div>
            <div className="flex grow flex-col gap-5 bg-white">
              <div className="flex grow gap-5 bg-white">
                <MedicContainer />
                <BookStoreContainer />
                <div className="flex grow flex-col gap-5 bg-white">
                  <BrunchContainer />
                  <KofetchContainer />
                </div>
              </div>
              <div className="flex h-2/5 gap-5 bg-white">
                <FEworldContainer />
                <BEworldContainer />
                <EmptyContainer />
              </div>
              <div className="flex grow gap-5 bg-white">
                <GithubContainer />
                <ActivityContainer />
                <InfraContainer />
              </div>
            </div>
          </div>
        </div>
      </main>
    </ColorProvider>
  );
}
