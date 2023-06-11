import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Calendar(props) {
 return (
  <Svg
   xmlns='http://www.w3.org/2000/svg'
   {...props}
   fill='currentColor'
   class='bi bi-calendar'
   viewBox='0 0 16 16'
  >
   <Path
    fill={props.fill}
    d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z'
   />
  </Svg>
 );
}

export default Calendar;
