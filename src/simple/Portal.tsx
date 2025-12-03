import React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode
  parent: HTMLElement
}

const Portal: React.FC<PortalProps> = ({ children, parent: element }) => {
  return ReactDOM.createPortal(children, element);
};

export default Portal;
