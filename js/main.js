'use strict'

const ROWS = 5
const SEATS = 13

const theatre = document.querySelector('.theatre')
const modal = document.querySelector('.modal')

let selectedSeat
let timeout

const reservedSeats = JSON.parse(localStorage.getItem('reservedSeats') || '{}')

function onInit() {
    renderSeats()
    window.addEventListener('click', handleOutsideClick)
}

function renderSeats() {
    theatre.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
        const rowDiv = document.createElement('div')
        rowDiv.className = 'seatRow'
        for (let j = 0; j < SEATS; j++) {
            const seat = document.createElement('div')
            seat.className = 'seat'
            seat.dataset.row = i
            seat.dataset.seat = j
            if (reservedSeats[`${i}-${j}`]) {
                seat.classList.add('reserved')
            }
            seat.addEventListener('click', (e) => {
                e.stopPropagation()
                handleSeatClick(i, j)
            })
            rowDiv.appendChild(seat)
        }
        theatre.appendChild(rowDiv)
    }
}

function handleSeatClick(row, seat) {
    const seatElement = document.querySelector(`.seat[data-row="${row}"][data-seat="${seat}"]`)
    if (!reservedSeats[`${row}-${seat}`]) {
        seatElement.classList.add('temporary')
        modal.style.display = 'block'
        modal.querySelector('.seatNum').textContent = `${+row + 1},${+seat + 1}`
        modal.querySelector('.seatPrice').textContent = getPrice(row, seat)
        selectedSeat = { row, seat, element: seatElement }
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            modal.style.display = 'none'
            seatElement.classList.remove('temporary')
        }, 10000)
    }
}

function bookSeat() {
    reservedSeats[`${selectedSeat.row}-${selectedSeat.seat}`] = true
    localStorage.setItem('reservedSeats', JSON.stringify(reservedSeats))
    modal.style.display = 'none'
    clearTimeout(timeout)
    selectedSeat.element.classList.remove('temporary')
    selectedSeat.element.classList.add('reserved')
}

function handleOutsideClick(event) {
    if (event.target !== modal && !modal.contains(event.target) && modal.style.display === 'block') {
        selectedSeat.element.classList.remove('temporary')
        modal.style.display = 'none'
        if (timeout) {
            clearTimeout(timeout)
        }
    }
}

function getPrice(row, seat) {
    return row < 3 ? '$20' : '$10'
}
