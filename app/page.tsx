import ColorProvider from "./providers/ColorProvider";
import ToggleColorButton from "./components/ToggleColorButton";

import IloveSkillContainer from "./components/box-contents-servercomponents/IloveSkillContainer";
import ResumeContainer from "./components/box-contents-servercomponents/ResumeContainer";
import GithubBlogContainer from "./components/box-contents-servercomponents/GithubBlogContainer";
import FashionContainer from "./components/box-contents-servercomponents/FashionContainer";
import InterestContainer from "./components/box-contents-servercomponents/InterestContainer";
import MedicContainer from "./components/box-contents-servercomponents/MedicContainer";
import BookStoreContainer from "./components/box-contents-servercomponents/BookStoreContainer";
import BrunchContainer from "./components/box-contents-servercomponents/BrunchContainer";
import KofetchContainer from "./components/box-contents-servercomponents/KofetchContainer";
import FEworldContainer from "./components/box-contents-servercomponents/FEworldContainer";
import BEworldContainer from "./components/box-contents-servercomponents/BEworldContainer";
import EmptyContainer from "./components/box-contents-servercomponents/EmptyContainer";
import GithubContainer from "./components/box-contents-servercomponents/GithubContainer";
import ActivityContainer from "./components/box-contents-servercomponents/ActivityContainer";
import InfraContainer from "./components/box-contents-servercomponents/InfraContainer";

export default function Home() {
  return (
    <ColorProvider>
      <main className="flex min-h-screen flex-col items-center justify-between bg-yellow-200 p-12">
        <h1 className="w-full text-center text-5xl font-extrabold">
          KYU-NIVERSE
        </h1>
        <div className="flex w-full text-left"></div>
        <div className="w-full text-right">
          <ToggleColorButton />
        </div>
        <div className="w-full rounded-md bg-white p-5">
          <div className="flex h-[1000px] w-full gap-5 bg-white">
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
