import React from 'react';

export default function NestedURLs200(props) {
    return (
        <React.Fragment>
            {Array.from(props.items).map(item =>
                <div key={item[1].id} className="columns is-vcentered is-centered is-mobile is-multiline">
                    <div className="column is-narrow has-text-centered is-hidden-mobile">
                        <p className="has-text-success">{item[1].urlCount} x </p>
                    </div>
                    <div className="column has-text-centered-mobile is-12-mobile">
                        <a className="has-text-success" href={item[1].url}>{item[1].url}</a>
                    </div>
                    <div className="column is-narrow has-text-centered is-3-mobile has-text-right-mobile">
                        <span className="tag is-success">{item[1].statusCode}</span>
                    </div>
                    <div className="column is-narrow has-text-centered is-3-mobile has-text-left-mobile">
                        <span className="tag is-success is-fixed">{item[1].rt}ms</span>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}
