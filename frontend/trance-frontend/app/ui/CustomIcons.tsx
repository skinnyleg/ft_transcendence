"use client"

import React, { ElementType } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip'
import { IoMdAddCircleOutline } from "react-icons/io";

interface IconWithTooltipProps {
	icon: any;
	tooltipId: string;
	tooltipContent: string;
	styles: string;
	clickBehavior?: () => void;
}

export const IconWithTooltip : React.FC<IconWithTooltipProps> = ({ icon, tooltipId, tooltipContent, styles, clickBehavior }) => {
	const IconComponent = icon;  // Dynamically assign the icon component based on the prop

  return (
    <div data-tip data-for={tooltipId} onClick={clickBehavior}>
      <IconComponent className={styles} data-tooltip-id={tooltipId} data-tooltip-content={tooltipContent}
			data-tooltip-place="bottom"
			data-tooltip-class-name='z-10'
		/>
      <Tooltip id={tooltipId} place="bottom" />
    </div>
  );
};


interface CreateChannelIconProps {
  style: string;
}

export const CreateChannelIcon : React.FC<CreateChannelIconProps> = ({style}) => {
	return (
			<IconWithTooltip
				icon={IoMdAddCircleOutline}
				styles={style}
				tooltipId="CreateChannelToolTip"
				tooltipContent="Create Channel"
			/>
	);
}
