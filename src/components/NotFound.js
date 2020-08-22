import React from 'react';

export default function NotFound() {
    return (
        <React.Fragment>
            <section id="top" className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title has-text-centered is-size-1">Page Not Found</h1>
                        <p className="subtitle has-text-centered"><a href="/">Home</a></p>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
}
