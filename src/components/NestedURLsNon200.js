import React from 'react';

export default function NestedURLsNon200(props) {
    return (
        <React.Fragment>
            {Array.from(props.items).map(item =>
                <div key={item[1].id} className="columns is-vcentered is-centered is-mobile is-multiline">
                    <div className="column is-narrow has-text-centered is-hidden-mobile">
                        {(item[1].statusCode === 404 || item[1].statusCode === 0) ?
                            <p className="has-text-danger">{item[1].urlCount} x </p>
                            :
                            <p className="has-text-warning">{item[1].urlCount} x </p>
                        }
                    </div>
                    <div className="column has-text-centered-mobile is-12-mobile">
                        {(item[1].statusCode === 404 || item[1].statusCode === 0) ?
                            <a className="has-text-danger" href={item[1].url}>{item[1].url}</a>
                            :
                            <a className="has-text-warning" href={item[1].url}>{item[1].url}</a>
                        }
                    </div>
                    <div className="column is-narrow has-text-centered is-3-mobile has-text-right-mobile">
                        {item[1].statusCode === 0 ?
                            <span className="tag is-danger">TIMEOUT</span>
                            :
                            item[1].statusCode === 404 ?
                                <span className="tag is-danger">{item[1].statusCode}</span>
                                :
                                <span className="tag is-warning">{item[1].statusCode}</span>
                        }
                    </div>
                    <div className="column is-narrow has-text-centered is-3-mobile has-text-left-mobile">
                        {(item[1].statusCode === 404 || item[1].statusCode === 0) ?
                            <span className="tag is-danger is-fixed">???</span>
                            :
                            <span className="tag is-warning is-fixed">{item[1].rt}ms</span>
                        }
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}
