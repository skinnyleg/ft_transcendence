"use client"

import React from 'react';
import PropTypes from 'prop-types';
import { IoMdSettings, /* other icons */ } from 'react-icons/io';  // Import other icons as needed
import { Tooltip } from 'react-tooltip'
import { IoMdAddCircleOutline } from "react-icons/io";

export const IconWithTooltip = ({ icon, tooltipId, tooltipContent, styles }) => {
  const IconComponent = icon;  // Dynamically assign the icon component based on the prop

  return (
    <div data-tip data-for={tooltipId}>
      <IconComponent className={styles} data-tooltip-id={tooltipId} data-tooltip-content={tooltipContent}/>
      <Tooltip id={tooltipId} />
    </div>
  );
};

IconWithTooltip.propTypes = {
  icon: PropTypes.elementType.isRequired,  // PropType for a React component type
  tooltipId: PropTypes.string.isRequired,
  tooltipContent: PropTypes.string.isRequired,
  styles: PropTypes.string.isRequired,
};


export const CreateChannelIcon = ({style}) => {
	return (
			<IconWithTooltip
				icon={IoMdAddCircleOutline}
				styles={style}
				tooltipId="CreateChannelToolTip"
				tooltipContent="Create Channel"
			/>
	);
}
