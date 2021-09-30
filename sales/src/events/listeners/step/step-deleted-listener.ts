import {Message, Stan} from 'node-nats-streaming';
import {Listener, NotFoundError, StepDeletedEvent, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Step} from "../../../models/Step";

export class StepDeletedListener extends Listener<StepDeletedEvent> {
    readonly subject = Subjects.StepDeleted;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: StepDeletedEvent['data'], msg: Message) {
        const {id} = data;

        const step = await Step.findById(id);
        if (!step) {
            throw new NotFoundError("Step")
        }

        await step.delete();

        msg.ack();
        console.log(`Step ${step.id} deleted!`)
    }
}