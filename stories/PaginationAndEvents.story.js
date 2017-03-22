import React, {Component} from 'react';
import {storiesOf} from '@kadira/storybook';
import {Board} from '../src';

let eventBus = undefined

const PER_PAGE = 15

const addCard = () => {
  eventBus.publish({type: 'ADD_CARD', laneId: 'Lane1', card: {id: "000", title: "EC2 Instance Down", label: "30 mins", description: "Main EC2 instance down"}})
}

function generateCards(requestedPage = 1) {
  const cards = []
  let fetchedItems = (requestedPage - 1) * PER_PAGE;
  for (let i = fetchedItems + 1; i <= fetchedItems + PER_PAGE; i++) {
    cards.push({
      id: `${i}`,
      title: `Card${i}`,
      description: `Description for #${i}`
    })
  }
  return cards
}

class BoardWrapper extends Component {

  state = {data: this.props.data}

  setEventBus = (handle) => {
    eventBus = handle
  }

  delayedPromise = (durationInMs, resolutionPayload) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(resolutionPayload);
      }, durationInMs)
    });
  }

  refreshCards = () => {
    const {data} = this.state
    data.lanes = [{
      id: 'Lane1',
      title: 'Changed Lane',
      cards: []
    }]
    this.setState({data: data})
  }


  paginate = (requestedPage, laneId) => {
    let newCards = generateCards(requestedPage);
    return this.delayedPromise(2000, newCards);
  }

  render() {
    return <div>
      <button onClick={addCard} style={{margin: 5}}>Add Card</button>
      <button onClick={this.refreshCards} style={{margin: 5}}>Refresh Board</button>
      <Board data={this.state.data}
             eventBusHandle={this.setEventBus}
             laneSortFunction={(card1, card2) => parseInt(card1.id) - parseInt(card2.id)}
             onLaneScroll={this.paginate}/>
    </div>
  }
}

storiesOf('react-trello', module)
  .addWithInfo('Scrolling and Events',
    `
      Infinite scroll with onLaneScroll function callback to fetch more items
      
      The callback function passed to onLaneScroll will be of the following form
      ~~~js
      function paginate(requestedPage, laneId) {
        return fetchCardsFromBackend(laneId, requestedPage); 
      };
      ~~~
    `,
    () => {

      const data = {
        lanes: [{
          id: 'Lane1',
          title: 'Lane1',
          cards: generateCards()
        }]
      }

      return <BoardWrapper data={data}/>
    })

