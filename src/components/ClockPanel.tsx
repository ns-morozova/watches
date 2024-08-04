import React, { Component } from 'react';
import moment from 'moment-timezone';
import styles from './styles.module.css';

interface Clock {
    id: number;
    name: string;
    timezone: string;
    offset: number;
}

interface ClockPanelState {
    clocks: Clock[];
    name: string;
    timezone: string;
}

class ClockPanel extends Component<{}, ClockPanelState> {
    private clockId: number;
    private intervals: Map<number, NodeJS.Timeout>;

    constructor(props: {}) {
        super(props);
        this.state = {
            clocks: [],
            name: '',
            timezone: '',
        };
        this.clockId = 0;
        this.intervals = new Map<number, NodeJS.Timeout>();
    }

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleTimezoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ timezone: event.target.value });
    };

    addClock = () => {
        const { name, timezone } = this.state;
        if (name && timezone) {
            const offset = parseInt(timezone, 10);
            const newClock: Clock = {
                id: this.clockId++,
                name,
                timezone,
                offset,
            };
            this.setState((prevState) => ({
                clocks: [...prevState.clocks, newClock],
                name: '',
                timezone: '',
            }), () => {
                this.startClock(newClock.id);
            });
        }
    };

    removeClock = (id: number) => {
        this.setState((prevState) => ({
            clocks: prevState.clocks.filter((clock) => clock.id !== id),
        }), () => {
            this.clearClockInterval(id);
        });
    };

    startClock = (id: number) => {
        this.intervals.set(id, setInterval(() => {
            this.forceUpdate();
        }, 1000));
    };

    clearClockInterval = (id: number) => {
        const interval = this.intervals.get(id);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(id);
        }
    };

    componentWillUnmount() {
        this.intervals.forEach((interval) => clearInterval(interval));
    }

    renderClock = (clock: Clock) => {
        const currentTime = moment().utcOffset(clock.offset);
        return (
            <div key={clock.id} className={styles.watchBlock}>
                <h3 className={styles.nameCity}>{clock.name}</h3>
                <p className={styles.time}>{currentTime.format('HH:mm:ss')}</p>
                <button className={styles.btnRemove} onClick={() => this.removeClock(clock.id)}>✖</button>
            </div>
        );
    };

    render() {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>World Clocks</h2>
                <div className={styles.inputsBlock}>
                    <input
                        type="text"
                        placeholder="city name"
                        value={this.state.name}
                        onChange={this.handleNameChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="timezone offset"
                        value={this.state.timezone}
                        onChange={this.handleTimezoneChange}
                        className={styles.input}
                    />
                    <button onClick={this.addClock}>Add Clock</button>
                </div>
                <div className={styles.watchList}>
                    {this.state.clocks.map(this.renderClock)}
                </div>
            </div>
        );
    }
}

export default ClockPanel;