import React from 'react';
import MaterialIcons from "react-native-vector-icons/FontAwesome";

const DrawerIcon = ({
   name, 
   deltaIconSize,
   color,
}) => {
   const iconsSize = 30;
   return (
      <MaterialIcons name={name} size={iconsSize + deltaIconSize} color={color} />
   );
};

export default DrawerIcon;