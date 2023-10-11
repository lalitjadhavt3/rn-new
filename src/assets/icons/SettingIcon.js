import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SettingIcon(props) {
  return (
    <Svg
      width={50}
      height={45}
      viewBox="0 0 1024 1024"
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M797.867 524.8L550.4 477.867l-83.2-238.934-81.067 27.734 83.2 236.8-166.4 192 64 55.466 166.4-192L780.8 605.867l17.067-81.067z"
        fill="#EF6C00"
      />
      <Path
        d="M512 405.333c-59.733 0-106.667 46.934-106.667 106.667S452.267 618.667 512 618.667 618.667 571.733 618.667 512 571.733 405.333 512 405.333zm0 149.334c-23.467 0-42.667-19.2-42.667-42.667s19.2-42.667 42.667-42.667 42.667 19.2 42.667 42.667-19.2 42.667-42.667 42.667z"
        fill="#30f"
      />
      <Path
        d="M868.267 576c4.266-21.333 6.4-42.667 6.4-64s-2.134-42.667-6.4-64l70.4-51.2c8.533-6.4 12.8-19.2 6.4-29.867l-91.734-157.866c-6.4-10.667-17.066-14.934-27.733-8.534l-78.933 34.134c-32-27.734-70.4-49.067-110.934-64L627.2 83.2C625.067 72.533 616.533 64 605.867 64H422.4c-10.667 0-21.333 8.533-21.333 19.2l-12.8 87.467c-40.534 14.933-78.934 36.266-110.934 64L198.4 198.4c-10.667-4.267-23.467 0-27.733 10.667L78.933 366.933c-6.4 10.667-2.133 23.467 6.4 29.867l70.4 51.2c-4.266 21.333-6.4 42.667-6.4 64s2.134 42.667 6.4 64l-70.4 51.2c-8.533 6.4-12.8 19.2-6.4 29.867l91.734 157.866c6.4 10.667 17.066 14.934 27.733 8.534l78.933-34.134c32 27.734 70.4 49.067 110.934 64L396.8 940.8c2.133 10.667 10.667 19.2 21.333 19.2H601.6c10.667 0 21.333-8.533 21.333-19.2l8.534-87.467C672 838.4 710.4 817.067 742.4 789.333l78.933 36.267c10.667 4.267 23.467 0 27.734-8.533L940.8 659.2c6.4-10.667 2.133-23.467-6.4-29.867L868.267 576zM512 746.667c-130.133 0-234.667-104.534-234.667-234.667S381.867 277.333 512 277.333 746.667 381.867 746.667 512 642.133 746.667 512 746.667z"
        fill="#30f"
      />
    </Svg>
  );
}

export default SettingIcon;