import React from 'react';

export default function NestedURLs(props) {
    return (
        <React.Fragment>
            {Array.from(props.items).map(item =>
                <div key={item[1].id} className="columns is-vcentered is-centered is-mobile is-multiline">
                    <div className="column is-narrow has-text-centered is-hidden-mobile">
                        <p className="has-text-black">{item[1].urlCount} x </p>
                    </div>
                    <div className="column has-text-centered-mobile is-12-mobile">
                        <a className="has-text-black" href={item[1].url}>{item[1].url}</a>
                    </div>
                    <div className="column is-narrow has-text-centered is-3-mobile has-text-right-mobile">
                        <span className="tag is-white is-loading">IN PROGRESS</span>
                    </div>
                    <div className="column is-narrow has-text-centered is-hidden-mobile">
                        <p className="has-text-black"></p>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}
