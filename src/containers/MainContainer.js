import React, { Component } from 'react';
import StockContainer from './StockContainer'
import PortfolioContainer from './PortfolioContainer'
import SearchBar from '../components/SearchBar'

class MainContainer extends Component {
  state = {
    stocks: [],
    portfolioIds: [],
    filter: 'All',
    sort: 'None'
  }

  componentDidMount() {
    fetch('http://localhost:3000/stocks')
      .then(resp => resp.json())
      .then(data => this.setState({ stocks: data }))
  }

  updateFilter = (filterBy) => {
    this.setState({ filter: filterBy })
  }

  updateSort = (sortBy) => {
    this.setState({ sort: sortBy })
  }

  addPortfolio = (id) => {
    if (!this.state.portfolioIds.find(portfolio => portfolio.id === id)) {
      this.setState({
        portfolioIds: [...this.state.portfolioIds, id]
      })
    }
  }

  removePortfolio = (id) => {
    this.setState({
      portfolioIds: this.state.portfolioIds.filter(stockId => stockId !== id)
    })
  }

  displayStocks = () => {
    let filteredStocks = [...this.state.stocks]

    if (this.state.filter !== 'All') {
      filteredStocks = filteredStocks.filter(stock => stock.type === this.state.filter)
    }

    switch (this.state.sort) {
      case 'Alphabetically':
        return filteredStocks.sort((a, b) => a.name > b.name ? 1 : -1)
      case 'Price':
        return filteredStocks.sort((a, b) => a.price > b.price ? 1 : -1)
      default:
        return filteredStocks
    }
  }

  render() {
    const filteredStocks = this.displayStocks()
    const portfolioStocks = [...this.state.portfolioIds.map(id => this.state.stocks.find(stock => stock.id === id))]

    return (
      <div>
        <SearchBar sort={this.state.sort} filter={this.state.filter} updateFilter={this.updateFilter} updateSort={this.updateSort} />
        <div className="row">
          <div className="col-8">
            <StockContainer stocks={filteredStocks} addPortfolio={this.addPortfolio} />
          </div>
          <div className="col-4">
            <PortfolioContainer portfolioStocks={portfolioStocks} removePortfolio={this.removePortfolio} />
          </div>
        </div>
      </div>
    );
  }

}

export default MainContainer;
