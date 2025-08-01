import Cube from './Cube';
import './RowCube.css';

function RowCube(props) {
  

  return (
    <div className='cube-row'>
      {props.stocks.map((cube, index) => (
        <Cube key={index} title={props.titles[index]} value={cube.close} raise={(((cube.close - cube.open) / cube.open) * 100)}/>
      ))}
    </div>
  );
}

export default RowCube;