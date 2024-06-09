import { CardSlider } from '../components/slider';
import {
  데이터베이스메타정보가져오기,
  데이터베이스쿼리조회,
} from '../providers/notion';

export default async function Slide() {
  return (
    <div className='slider-container'>
      <CardSlider />
    </div>
  );
}
