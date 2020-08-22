import React from 'react';

export default function Stats(props) {
    return (
        <React.Fragment>
            <section className="section">
                <div className="container is-fluid">
                    <div className="columns is-vcentered is-centered">
                        <div className="column is-12-mobile is-8">
                            <nav className="level">
                                {props.targetUrlStatusCode === 200 &&
                                    <div className="level-item has-text-centered">
                                        <div>
                                            <p className="heading">{props.targetUrlForResults}</p>
                                            <p className="title has-text-success">loads fine!</p>
                                        </div>
                                    </div>
                                }
                                <div className="level-item has-text-centered">
                                    <div>
                                        <p className="heading">Status Code</p>
                                        <p className="title">{props.targetUrlStatusCode}</p>
                                    </div>
                                </div>
                                <div className="level-item has-text-centered">
                                    <div>
                                        <p className="heading">Response Time</p>
                                        <p className="title">{props.targetUrlResponseTime}ms</p>
                                    </div>
                                </div>
                                <div className="level-item has-text-centered">
                                    <div>
                                        <p className="heading">Nested URLs</p>
                                        <p className="title">{props.nestedUrlsCount}</p>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}
