import React, { Component, Fragment } from 'react'
import './Main.css'
import $ from 'jquery'
import Media from 'react-media'



class Main extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            categories: [],
            joke: {},
            category: "",
            nameOfCat: "",
            jokes: [],
            favourites: [],
            searchFav: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.Submit = this.Submit.bind(this);
        this.GetDate = this.GetDate.bind(this);
        this.ClickCategory = this.ClickCategory.bind(this);
        this.Favourite = this.Favourite.bind(this);
        this.getFromLocalStorage = this.getFromLocalStorage.bind(this);
        this.removeFavourite = this.removeFavourite.bind(this);
        this.mobileFavouriteOpen = this.mobileFavouriteOpen.bind(this);
        this.mobileFavouriteClose = this.mobileFavouriteClose.bind(this);
        this.tabletFavouriteOpen = this.tabletFavouriteOpen.bind(this);
        this.tabletFavouriteClose = this.tabletFavouriteClose.bind(this);
    };
    mobileFavouriteClose() {
        $('.fav-open').css('display', 'inline');
        $('.fav-close').css('display', 'none');
        $('.container-favourite').css('transition', 'margin .5s');
        $('.container-favourite').css('margin', '0 -200% 0 0');
        $('.container-left').css('margin', '0 0 0 0');
    }
    mobileFavouriteOpen() {
        $('.fav-close').css('display', 'inline');
        $('.fav-open').css('display', 'none');
        $('.container-favourite').css('margin', '0 0 0 0');
        $('.container-left').css('transition', 'margin .5s');
        $('.container-left').css('margin', '0 0 0 -200%');
    }
    tabletFavouriteClose() {
        $('.container-favourite').css('position', 'unset');
        $('.overlay').css('display', 'none');
    }
    tabletFavouriteOpen() {
        $('.container-favourite').css('position', 'absolute');
        $('.overlay').css('display', 'block');
    }
    handleChange = (event) => {
        this.setState({ category: event.target.value });

        if (event.target.value === "category") {
            $("#block-category").css('display', 'inline-block')
        }
        else {
            $("#block-category").css('display', 'none')
        }
        if (event.target.value === "search") {
            $("#searchText").css('display', 'inline')
        }
        else {
            $("#searchText").css('display', 'none')
        }


    }
    ClickCategory = (event) => {
        for (let i = 0; i < this.state.categories.length; i++) {
            $(`#btn-categories${i}`).css('background-color', 'transparent');
            $(`#btn-categories${i}`).css('color', '#ABABAB');
        }
        event.target.style.background = '#F8F8F8';
        event.target.style.color = '#333333';
        this.setState({ nameOfCat: event.target.value });

    }

    Favourite = (url, id, text, update) => {
        let inStorage = false

        if (localStorage.getItem(id)) {
            inStorage = true;
        }

        if (inStorage === false) {
            localStorage.setItem(id, JSON.stringify({ 'url': url, 'id': id, 'text': text, 'update': update }));
            this.getFromLocalStorage(id);

        }

    }
    removeFavourite = (index, k) => {
        localStorage.removeItem(index)
        this.state.favourites.splice(k, 1);

    }


    Submit() {
        if (this.state.category === "random") {
            fetch("https://api.chucknorris.io/jokes/random")
                .then(response => response.json())
                .then(joke => (this.setState({ joke })))
            $("#joke-container").css('display', 'flow-root')
            $("#jokes-search").css('display', 'none')
            this.state.nameOfCat = ""
            $('#search-input')[0].value = ""
            for (let i = 0; i < this.state.categories.length; i++) {
                $(`#btn-categories${i}`).css('background-color', 'transparent');
                $(`#btn-categories${i}`).css('color', '#ABABAB');
            }

        }
        if (this.state.category === "category") {
            fetch(`https://api.chucknorris.io/jokes/random?category=${this.state.nameOfCat}`)
                .then(response => response.json())
                .then(joke => (this.setState({ joke })))
            $("#joke-container").css('display', 'flow-root')
            $("#jokes-search").css('display', 'none')
            $('#search-input')[0].value = ""
        }
        if (this.state.category === "search") {
            this.state.nameOfCat = ""
            let query = $('#search-input')[0].value;

            for (let i = 0; i < this.state.categories.length; i++) {
                $(`#btn-categories${i}`).css('background-color', 'transparent');
                $(`#btn-categories${i}`).css('color', '#ABABAB');
            }
            for (let i = 0; i < localStorage.length; i++) {
                let str = JSON.parse(localStorage.getItem(localStorage.key(i))).text;
                if (str.indexOf(query) !== -1) {

                    this.setState(previousState => ({
                        searchFav: [...previousState.searchFav, JSON.parse(localStorage.getItem(localStorage.key(i))).id]
                    }));
                }
            }


            fetch(`https://api.chucknorris.io/jokes/search?query=${query}`)
                .then(response => response.json())
                .then(jokes => (this.setState({ jokes })))
            $("#jokes-search").css('display', 'block')
            $("#joke-container").css('display', 'none')


        }
    }


    getFromLocalStorage(index) {
        this.setState(previousState => ({
            favourites: [...previousState.favourites, JSON.parse(localStorage.getItem(index))]
        }));
    }

    componentDidMount() {
        for (let i = 0; i < localStorage.length; i++) {

            this.setState(previousState => ({
                favourites: [...previousState.favourites, JSON.parse(localStorage.getItem(localStorage.key(i)))]
            }));
        }


        fetch("https://api.chucknorris.io/jokes/categories")
            .then(response => response.json())
            .then(categories => (this.setState({ categories })))
    }

    GetDate(date) {
        let update = new Date(date);
        let now = new Date();
        let diff = (now - update) / 1000 / 60
        if (diff < 60) {
            return Math.round(diff) + " min "
        }
        else if ((diff / 60) >= 60 & (diff / 60) < 24) {
            return Math.round(diff / 60) + " hours "
        }
        else {
            return Math.round(diff / 60 / 24) + " days "
        }
    }

    render() {

        return (
            <div>

                <Media queries={{
                    small: "(max-width: 599px)",
                    medium: "(min-width: 600px) and (max-width: 1199px)",
                    large: "(min-width: 1200px)"
                }}>
                    {matches => (
                        <Fragment>
                            {matches.small &&
                                <div>

                                    <div className="top-inline">
                                        <p className="headText">MSI 2020</p>
                                        <h1 className="fav-h1"><img className="fav-close" src={require('./Group 22-2.png')} onClick={this.mobileFavouriteClose} /> <img className="fav-open" src={require('./Group 22.png')} onClick={this.mobileFavouriteOpen} />Favourite</h1>
                                    </div>
                                    <div className="container-left">
                                        <h1 className="hey">Hey!</h1>
                                        <p className="heySub">Let’s try to find a joke for you:</p>
                                        <form>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="random" id="rand" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="rand">Random</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="category" id="category" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="category">From caterogies</label>
                                            </div>
                                            <div className="block-category" id="block-category">
                                                {this.state.categories.map((category, index) =>

                                                    <input type="button" id={new String(`btn-categories${index}`)} className="btn-categories" key={index} value={category} onClick={this.ClickCategory} />)
                                                }
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="search" id="search" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="search">Search</label>
                                            </div>
                                            <div className="searchText" id="searchText">
                                                <input type="text" placeholder="Free text search..." className="search-input" id="search-input"></input>
                                            </div>
                                            <button type="button" onClick={this.Submit} className="get-btn">Get a joke</button>

                                        </form>

                                        <div className="joke-container" id="joke-container">
                                            <button type="button" className="heart" onClick={this.Favourite.bind(this, this.state.joke.url, this.state.joke.id, this.state.joke.value, this.GetDate(this.state.joke.updated_at))} />
                                            <div className="card-joke">
                                                <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                <div className="block-txt">
                                                    <p className="href-p">ID: </p><a href={this.state.joke.url} name="url" className="href">{this.state.joke.id}
                                                        <img className="link" src={require('./link.png')} /></a>
                                                    <p className="joke-txt" name="text">{this.state.joke.value}</p>
                                                </div>
                                            </div>

                                            <p className="date" name="update">Last update: {this.GetDate(this.state.joke.updated_at)} ago</p>
                                            {this.state.joke.categories !== undefined ?
                                                this.state.joke.categories.map((category, index) =>
                                                    <input type="button" className="btn-category" name="nameOfcategory" key={index} value={category} />
                                                ) :
                                                ""
                                            }


                                        </div>

                                        <div className="jokes-search" id="jokes-search">
                                            {

                                                this.state.jokes.result === undefined ?
                                                    ""
                                                    :
                                                    this.state.jokes.result.map((joke, index) =>
                                                        <div className="joke-container2" key={index}>
                                                            {
                                                                this.state.searchFav.indexOf(joke.id) === -1 ?
                                                                    <button type="button" className="heart" onClick={this.Favourite.bind(this, joke.url, joke.id, joke.value, this.GetDate(joke.updated_at))} />
                                                                    :
                                                                    <button type="button" className="heart2" onClick={this.removeFavourite.bind(this, joke.id, index)} />
                                                            }

                                                            <div className="card-joke">
                                                                <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                                <div className="block-txt">
                                                                    <p className="href-p">ID: </p><a href={joke.url} className="href">{joke.id}
                                                                        <img className="link" src={require('./link.png')} /></a>
                                                                    <p className="joke-txt">{joke.value}</p>
                                                                </div>
                                                            </div>

                                                            <p className="date" >Last update: {this.GetDate(joke.updated_at)} ago</p>
                                                            {joke.categories !== undefined ?
                                                                joke.categories.map((category, ind) =>
                                                                    <input type="button" className="btn-category" key={ind} value={category} />
                                                                ) :
                                                                ""
                                                            }


                                                        </div>)
                                            }
                                        </div>


                                    </div>

                                    <div className="container-favourite" id="container-favourite">

                                        {
                                            this.state.favourites.length === 0 ?
                                                ""
                                                :
                                                this.state.favourites.map((joke, index) =>
                                                    <div className="joke-favourite" id="joke-favourite" key={index}>
                                                        <button type="button" className="heart2" onClick={this.removeFavourite.bind(this, joke.id, index)} />
                                                        <div className="card-joke">
                                                            <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                            <div className="block-txt">
                                                                <p className="href-p">ID: </p><a href={joke.url} className="href">{joke.id}
                                                                    <img className="link" src={require('./link.png')} /></a>
                                                                <p className="joke-txt">{joke.text}</p>
                                                            </div>
                                                        </div>

                                                        <p className="date" >Last update: {joke.update} ago</p>


                                                    </div>
                                                )
                                        }
                                    </div>

                                </div>
                            }
                            {matches.medium &&
                                <div>

                                    <div className="container-left">

                                        <p className="headText">MSI 2020</p>
                                        <h1 className="fav-h1"> <img className="fav-open" src={require('./Group 22.png')} onClick={this.tabletFavouriteOpen} />Favourite</h1>

                                        <h1 className="hey">Hey!</h1>
                                        <p className="heySub">Let’s try to find a joke for you:</p>
                                        <form>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="random" id="rand" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="rand">Random</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="category" id="category" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="category">From caterogies</label>
                                            </div>
                                            <div className="block-category" id="block-category">
                                                {this.state.categories.map((category, index) =>

                                                    <input type="button" id={new String(`btn-categories${index}`)} className="btn-categories" key={index} value={category} onClick={this.ClickCategory} />)
                                                }
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="search" id="search" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="search">Search</label>
                                            </div>
                                            <div className="searchText" id="searchText">
                                                <input type="text" placeholder="Free text search..." className="search-input" id="search-input"></input>
                                            </div>
                                            <button type="button" onClick={this.Submit} className="get-btn">Get a joke</button>

                                        </form>

                                        <div className="joke-container" id="joke-container">
                                            <button type="button" className="heart" onClick={this.Favourite.bind(this, this.state.joke.url, this.state.joke.id, this.state.joke.value, this.GetDate(this.state.joke.updated_at))} />
                                            <div className="card-joke">
                                                <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                <div className="block-txt">
                                                    <p className="href-p">ID: </p><a href={this.state.joke.url} name="url" className="href">{this.state.joke.id}
                                                        <img className="link" src={require('./link.png')} /></a>
                                                    <p className="joke-txt" name="text">{this.state.joke.value}</p>
                                                </div>
                                            </div>

                                            <p className="date" name="update">Last update: {this.GetDate(this.state.joke.updated_at)} ago</p>
                                            {this.state.joke.categories !== undefined ?
                                                this.state.joke.categories.map((category, index) =>
                                                    <input type="button" className="btn-category" name="nameOfcategory" key={index} value={category} />
                                                ) :
                                                ""
                                            }


                                        </div>

                                        <div className="jokes-search" id="jokes-search">

                                            {this.state.jokes.result === undefined ?
                                                ""
                                                :
                                                this.state.jokes.result.map((joke, index) =>
                                                    <div className="joke-container2" key={index}>
                                                        <button type="button" className="heart" onClick={this.Favourite.bind(this, joke.url, joke.id, joke.value, this.GetDate(joke.updated_at))} />
                                                        <div className="card-joke">
                                                            <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                            <div className="block-txt">
                                                                <p className="href-p">ID: </p><a href={joke.url} className="href">{joke.id}
                                                                    <img className="link" src={require('./link.png')} /></a>
                                                                <p className="joke-txt">{joke.value}</p>
                                                            </div>
                                                        </div>

                                                        <p className="date" >Last update: {this.GetDate(joke.updated_at)} ago</p>
                                                        {joke.categories !== undefined ?
                                                            joke.categories.map((category, ind) =>
                                                                <input type="button" className="btn-category" key={ind} value={category} />
                                                            ) :
                                                            ""
                                                        }


                                                    </div>)
                                            }
                                        </div>


                                    </div>

                                    <div className="overlay"></div>
                                    <div className="container-favourite" id="container-favourite">
                                        <h1 className="fav-h1"><img className="fav-close" src={require('./Group 22-2.png')} onClick={this.tabletFavouriteClose} />Favourite</h1>
                                        {
                                            this.state.favourites.length === 0 ?
                                                ""
                                                :
                                                this.state.favourites.map((joke, index) =>
                                                    <div className="joke-favourite" id="joke-favourite" key={index}>
                                                        <button type="button" className="heart" onClick={this.removeFavourite.bind(this, joke.id, index)} />
                                                        <div className="card-joke">
                                                            <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                            <div className="block-txt">
                                                                <p className="href-p">ID: </p><a href={joke.url} className="href">{joke.id}
                                                                    <img className="link" src={require('./link.png')} /></a>
                                                                <p className="joke-txt">{joke.text}</p>
                                                            </div>
                                                        </div>

                                                        <p className="date" >Last update: {joke.update} ago</p>


                                                    </div>
                                                )
                                        }
                                    </div>

                                </div>
                            }
                            {matches.large &&
                                <div>
                                    <div className="container-left">
                                        <p className="headText">MSI 2020</p>
                                        <h1 className="hey">Hey!</h1>
                                        <p className="heySub">Let’s try to find a joke for you:</p>
                                        <form>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="random" id="rand" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="rand">Random</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="category" id="category" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="category">From caterogies</label>
                                            </div>
                                            <div className="block-category" id="block-category">
                                                {this.state.categories.map((category, index) =>

                                                    <input type="button" id={new String(`btn-categories${index}`)} className="btn-categories" key={index} value={category} onClick={this.ClickCategory} />)
                                                }
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" name="radio" type="radio" value="search" id="search" onChange={this.handleChange} ></input>
                                                <label className="form-check-label" htmlFor="search">Search</label>
                                            </div>
                                            <div className="searchText" id="searchText">
                                                <input type="text" placeholder="Free text search..." className="search-input" id="search-input"></input>
                                            </div>
                                            <button type="button" onClick={this.Submit} className="get-btn">Get a joke</button>

                                        </form>

                                        <div className="joke-container" id="joke-container">
                                            <button type="button" className="heart" onClick={this.Favourite.bind(this, this.state.joke.url, this.state.joke.id, this.state.joke.value, this.GetDate(this.state.joke.updated_at))} />
                                            <div className="card-joke">
                                                <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                <div className="block-txt">
                                                    <p className="href-p">ID: </p><a href={this.state.joke.url} name="url" className="href">{this.state.joke.id}
                                                        <img className="link" src={require('./link.png')} /></a>
                                                    <p className="joke-txt" name="text">{this.state.joke.value}</p>
                                                </div>
                                            </div>

                                            <p className="date" name="update">Last update: {this.GetDate(this.state.joke.updated_at)} ago</p>
                                            {this.state.joke.categories !== undefined ?
                                                this.state.joke.categories.map((category, index) =>
                                                    <input type="button" className="btn-category" name="nameOfcategory" key={index} value={category} />
                                                ) :
                                                ""
                                            }


                                        </div>

                                        <div className="jokes-search" id="jokes-search">

                                            {this.state.jokes.result === undefined ?
                                                ""
                                                :
                                                this.state.jokes.result.map((joke, index) =>
                                                    <div className="joke-container2" key={index}>
                                                        <button type="button" className="heart" onClick={this.Favourite.bind(this, joke.url, joke.id, joke.value, this.GetDate(joke.updated_at))} />
                                                        <div className="card-joke">
                                                            <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                            <div className="block-txt">
                                                                <p className="href-p">ID: </p><a href={joke.url} className="href">{joke.id}
                                                                    <img className="link" src={require('./link.png')} /></a>
                                                                <p className="joke-txt">{joke.value}</p>
                                                            </div>
                                                        </div>

                                                        <p className="date" >Last update: {this.GetDate(joke.updated_at)} ago</p>
                                                        {joke.categories !== undefined ?
                                                            joke.categories.map((category, ind) =>
                                                                <input type="button" className="btn-category" key={ind} value={category} />
                                                            ) :
                                                            ""
                                                        }


                                                    </div>)
                                            }
                                        </div>


                                    </div>

                                    <div className="container-favourite" id="container-favourite">
                                        <h1 className="fav-h1">Favourite</h1>
                                        {
                                            this.state.favourites.length === 0 ?
                                                ""
                                                :
                                                this.state.favourites.map((joke, index) =>
                                                    <div className="joke-favourite" id="joke-favourite" key={index}>
                                                        <button type="button" className="heart" onClick={this.removeFavourite.bind(this, joke.id, index)} />
                                                        <div className="card-joke">
                                                            <div className="round"><img className="message mx-auto" src={require('./message.png')} /></div>
                                                            <div className="block-txt">
                                                                <p className="href-p">ID: </p><a href={joke.url} className="href">{joke.id}
                                                                    <img className="link" src={require('./link.png')} /></a>
                                                                <p className="joke-txt">{joke.text}</p>
                                                            </div>
                                                        </div>

                                                        <p className="date" >Last update: {joke.update} ago</p>


                                                    </div>
                                                )
                                        }
                                    </div>
                                </div>
                            }
                        </Fragment>
                    )}
                </Media>
            </div>
        )
    }
}


$(document).ready(function () {
    $('.heart').on('click', function () {
        if ($(this).hasClass('change-img')) {
            $(this).removeClass('change-img');

        } else {
            $('.heart').removeClass('change-img');
            $(this).addClass('change-img');
        }
    });
    $('.get-btn').on('click', function () {
        $('.heart').removeClass('change-img');

    });
    $(document).click(function (event) {
        if ($(event.target)[0].classList.value === "heart") {
            $(event.target)[0].className = "heart2"
        }
        else if ($(event.target)[0].classList.value === "heart2") {
            if ($(event.target)[0].parentElement.className === "joke-favourite") {
                $(event.target)[0].parentElement.hidden = true
            }

            $(event.target)[0].className = "heart"
        }

        event.stopPropagation();
    });
});


export default Main