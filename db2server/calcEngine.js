
const calculateMessageRatios = async (suppliers) => {
    return suppliers.map(supplier => {
        return {
            ...supplier,
            messageRatio: supplier.messages_sent / supplier.messages_recv
        }
    })
}

const calculateCompletionRatios = async (suppliers) => {
    return suppliers.map(supplier => {
        const p1Jobs = supplier.workorders.nodes.filter(workOrder => workOrder.priority == 0);
        const p2Jobs = supplier.workorders.nodes.filter(workOrder => workOrder.priority == 1);
        const p3Jobs = supplier.workorders.nodes.filter(workOrder => workOrder.priority > 1);

        const calcCompleted = (jobs) => jobs.length == 0 ? 0 : (
            jobs.map(current => (Number(new Date(current.date_due)) > Number(new Date(current.date_completed)) ? 1 : 0))
                .reduce((total, active) => total + active)
        );

        const p1JobsCompleted = calcCompleted(p1Jobs);
        const p2JobsCompleted = calcCompleted(p2Jobs);
        const p3JobsCompleted = calcCompleted(p3Jobs);
        return {
            ...supplier,
            p1JobsCompleted,
            p2JobsCompleted,
            p3JobsCompleted,
            p1CompletionRatio: p1Jobs.length == 0 ? 0 : (p1JobsCompleted / p1Jobs.length),
            p2CompletionRatio: p2Jobs.length == 0 ? 0 : (p2JobsCompleted / p2Jobs.length),
            p3CompletionRatio: p3Jobs.length == 0 ? 0 : (p3JobsCompleted / p3Jobs.length),
        }

    })
}

const calculateFinalRating = async (suppliers) => {
    return suppliers.map(supplier => {
        const rating = 10 * (
            (Math.min(1, supplier.messageRatio)
                + supplier.p1CompletionRatio
                + (supplier.p2CompletionRatio * 0.6)
                + (supplier.p3CompletionRatio * 0.3)
            ) / (1 + 1 + 0.6 + 0.3)
        );
        return {
            ...supplier,
            rating: Math.round(rating * 10) / 10
        }
    })

}

module.exports = {
    calculateMessageRatios,
    calculateCompletionRatios,
    calculateFinalRating,
}