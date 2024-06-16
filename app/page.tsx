import ColorProvider from './providers/ColorProvider';
import ToggleColorButton from './components/ToggleColorButton';

import IloveSkillContainer from './components/box-contents-servercomponents/IloveSkillContainer';
import ResumeContainer from './components/box-contents-servercomponents/ResumeContainer';
import GithubBlogContainer from './components/box-contents-servercomponents/GithubBlogContainer';
import FashionContainer from './components/box-contents-servercomponents/FashionContainer';
import InterestContainer from './components/box-contents-servercomponents/InterestContainer';
import MedicContainer from './components/box-contents-servercomponents/MedicContainer';
import BookStoreContainer from './components/box-contents-servercomponents/BookStoreContainer';
import BrunchContainer from './components/box-contents-servercomponents/BrunchContainer';
import KofetchContainer from './components/box-contents-servercomponents/KofetchContainer';
import FEworldContainer from './components/box-contents-servercomponents/FEworldContainer';
import BEworldContainer from './components/box-contents-servercomponents/BEworldContainer';
import EmptyContainer from './components/box-contents-servercomponents/EmptyContainer';
import GithubContainer from './components/box-contents-servercomponents/GithubContainer';
import ActivityContainer from './components/box-contents-servercomponents/ActivityContainer';
import InfraContainer from './components/box-contents-servercomponents/InfraContainer';

export default function Home() {
  return (
    <ColorProvider>
      <main className='flex min-h-screen flex-col items-center justify-between p-12 bg-yellow-200'>
        <h1 className='w-full text-center font-extrabold text-5xl'>
          KYUNIVERSE
        </h1>
        <div className='w-full flex text-left'></div>
        <div className='w-full text-right'>
          <ToggleColorButton />
        </div>
        <div className='w-full p-5 bg-white rounded-md'>
          <div className='w-full h-[1000px] flex bg-white gap-5'>
            <div className='w-2/6 h-full flex flex-col bg-white gap-5'>
              <div className='w-full flex grow gap-5'>
                <div className='w-1/2 h-full flex flex-col bg-white gap-5'>
                  <ResumeContainer />
                  <IloveSkillContainer />
                  <GithubBlogContainer />
                </div>
                <FashionContainer />
              </div>
              <InterestContainer />
            </div>
            <div className='flex flex-col grow bg-white gap-5'>
              <div className='flex grow bg-white gap-5'>
                <MedicContainer />
                <BookStoreContainer />
                <div className='flex flex-col grow bg-white gap-5'>
                  <BrunchContainer />
                  <KofetchContainer />
                </div>
              </div>
              <div className='flex h-2/5 bg-white gap-5'>
                <FEworldContainer />
                <BEworldContainer />
                <EmptyContainer />
              </div>
              <div className='flex grow bg-white gap-5'>
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
