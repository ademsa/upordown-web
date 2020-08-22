import React from 'react';

export default function StatusMessage(props) {
    return (
        <React.Fragment>
            <section className="section">
                <div className="container">
                    <div className="columns is-vcentered is-centered">
                        <div className="column is-12-mobile is-8">
                            {props.wsStatusMsg &&
                                <article className="notification is-danger">
                                    <p className="has-text-white">{props.wsStatusMsg}</p>
                                </article>
                            }
                            {props.targetUrlStatusMsg &&
                                <article className="notification is-danger">
                                    <p>{props.targetUrlStatusMsg}</p>
                                </article>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}
