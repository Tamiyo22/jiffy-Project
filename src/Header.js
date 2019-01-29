import React from 'react';
import clearButton from './images/close-icon.svg';

const Header = ({ clearSearch, hasResults }) => (
	<div className="header grid">
		{hasResults ? (
			<button onClick={clearSearch}>
				<img src={clearButton} />
			</button>
		) : (
			<h1 className="title"> Jiffy </h1>
		)}
	</div>
);

export default Header;
