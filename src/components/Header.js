import React from 'react';

export default function Header() {
    return (
        <React.Fragment>
            <section id="top" className="hero is-mobile">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title has-text-centered uod-logo">Up ? Down</h1>
                        <p className="subtitle has-text-centered">Detect if endpoint and related urls (links, scripts, etc.) load fine</p>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}
