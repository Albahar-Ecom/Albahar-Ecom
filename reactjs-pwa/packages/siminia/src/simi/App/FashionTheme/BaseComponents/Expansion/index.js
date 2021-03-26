import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import classify from 'src/classify';
import defaultStyle from './style.css';

const Expansion = props => {
    const { classes, id, title, content, icon_color, expanded, defaultExpand } = props;
    const defaultExp = (defaultExpand !== null && id === defaultExpand) ? true : false;
    const expandedMain = (defaultExpand !== null && id === defaultExpand) ? `harlow-epx-${defaultExpand}` : expanded;
    const handleCollapse = panel => (event, expanded) => {
        props.handleExpand(expanded ? panel : false);
    };

    return (
        <Accordion
            className={classes["simi-expansion-panel"]}
            defaultExpanded={defaultExp}
            expanded={expandedMain === `harlow-epx-${id}`}
            onChange={handleCollapse(`harlow-epx-${id}`)}
        >
            <AccordionSummary
                className={classes["simi-expansion-heading"]}
                expandIcon={
                    expandedMain === `harlow-epx-${id}` ? (
                        <i className="icon-chevron-down icons"></i>
                    ) : (
                        <i className="icon-chevron-down icons"></i>
                    )
                }
            >
                {title}
            </AccordionSummary>
            <AccordionDetails
                className={classes["simi-expansion-content"]}
                style={{ display: "block" }}
            >
                {content}
            </AccordionDetails>
        </Accordion>
    )
}

export default classify(defaultStyle)(Expansion)