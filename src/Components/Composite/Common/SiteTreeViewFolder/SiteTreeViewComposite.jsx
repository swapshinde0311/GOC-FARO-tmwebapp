import React from 'react';
import SiteTreeView from './SiteTreeView';

export function SiteTreeViewComposite({
    terminalList,
    onSaved,
    selectedTerminal,
    isEntryGate,
    isGantry,
    isExitGate,
    onDelete
}) {
    return (
        <SiteTreeView
            terminalList={terminalList}
            onSaved={onSaved}
            onDelete={onDelete}
            isEntryGate={isEntryGate}
            isGantry={isGantry}
            isExitGate={isExitGate}
            selectedTerminal={selectedTerminal}
        ></SiteTreeView>
    );
}

