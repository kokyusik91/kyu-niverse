import FashionContainer from "../components/box-contents-container-server-components/FashionContainer";
import ColorProvider from "../providers/ColorProvider";

export default function ClosetPage(){
    return <main className="w-full h-screen flex justify-center items-center">
                    <ColorProvider>
                    <FashionContainer /></ColorProvider>
    </main>
}