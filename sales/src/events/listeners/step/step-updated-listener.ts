import {Message, Stan} from 'node-nats-streaming';
import {Listener, NotFoundError, StepUpdatedEvent, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Step} from "../../../models/Step";

export class StepUpdatedListener extends Listener<StepUpdatedEvent> {
    readonly subject = Subjects.StepUpdated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: StepUpdatedEvent['data'], msg: Message) {
        const {id, stepTime, quantity} = data;

        const step = await Step.findById(id);
        if (!step) {
            throw new NotFoundError("Step");
        }

        step.set({stepTime, quantity})

        await step.save();

        msg.ack();
        console.log(`Step ${step.id} updated!`)

    }
}