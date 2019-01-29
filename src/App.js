import React, { Component } from 'react';
import Header from './Header';
import loader from './images/loader.svg';
import Gif from './Gif';

const randomChoice = (arr) => {
	const index = Math.floor(Math.random() * arr.length);
	return arr[index];
};

const UserHint = ({ loading, hintText }) => (
	<div className="user-hint">
		{loading ? <img className="block mx-auto" src={loader} /> : hintText}
	</div>
);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			searchTerm: '',
			hintText: '',
			gifs: []
		};
	}
	//we want a function that searchs the giphy api using fetch
	// and puts the search term into the search url
	searchGiphy = async (searchTerm) => {
		this.setState({
			//here set our loading to be true
			//it will show our spinner at the bottom
			loading: true
		});
		try {
			const response = await fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=FmpayQwMccUiJ6mqAubpN7WitHfxQov3&q=${searchTerm}&limit=50&offset=0&rating=PG&lang=en`
			);

			const { data } = await response.json();

			//here we check if the array is empty
			//if it is we stop and throw to the catch

			if (!data.length) {
				throw `Nothing found for ${searchTerm}`;
			}

			const randomGif = randomChoice(data);

			this.setState((prevState, props) => ({
				...prevState,
				gifs: [...prevState.gifs, randomGif],
				loading: false,
				hintText: `Hit enter to see more ${searchTerm}`
			}));
		} catch (error) {
			this.setState((prevState, props) => ({
				...prevState,
				hintText: error,
				loading: false
			}));
		}
	};

	handleChange = (event) => {
		const { value } = event.target;
		this.setState((prevState, props) => ({
			...prevState,
			searchTerm: value,
			hintText: value.length > 2 ? `Hint enter to search ${value}` : ''
		}));
	};

	handleKeyPress = (event) => {
		const { value } = event.target;
		if (value.length > 2 && event.key === 'Enter') {
			//here I am calling searchGiphy function using the search term
			this.searchGiphy(value);
		}
	};

	//here we reset our state and making it default

	clearSearch = () => {
		this.setState((prevState, props) => ({
			...prevState,
			searchTerm: '',
			hintText: '',
			gifs: []
		}));
		//grab the input and focus the cursor back into it
		this.textInput.focus();
	};
	render() {
		const { searchTerm, gifs } = this.state;
		const hasResults = gifs.length;
		return (
			<div className="page">
				<Header clearSearch={this.clearSearch} hasResults={hasResults} />

				<div className="search grid">
					{/* stack of images*/}

					{this.state.gifs.map((gif) => <Gif {...gif} />)}

					<input
						className="input grid-item"
						placeholder="Type Something"
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
						value={searchTerm}
						ref={(input) => {
							this.textInput = input;
						}}
					/>
				</div>
				<UserHint {...this.state} />
			</div>
		);
	}
}

export default App;
