import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getConversationRequest, conversationRequestAccept, getConversation, conversationRequestDecline, conversationRemove } from '../../redux/action/employers.action';

const EmployerConnectionPopUp = (props) => {
    const [showConnections, setShowConnections] = useState(true);
    const [showRequests, setShowRequests] = useState(false);
    const [newRequest, setNewRequest] = useState(0);
    const [conversationCount, setConversationCount] = useState(0);
    const [selectedConversation, setSelectedConversation] = useState();
    const [openOptionsConversationId, setOpenOptionsConversationId] = useState(null);

    const dispatch = useDispatch();
    const containerRef = useRef(null);

    const conversationRequest = useSelector(({ employerSignUp }) => {
        return employerSignUp?.newRequest?.conversation;
    });

    const connections = useSelector(({ employerSignUp }) => {
        return employerSignUp?.connections?.conversation;
    });

    useEffect(() => {
        dispatch(getConversation(props.id));
        dispatch(getConversationRequest(props.id));
    }, [dispatch, props?.id, props?.trigger, newRequest, conversationCount]);

    useEffect(() => {
        setNewRequest(conversationRequest?.length);
        setConversationCount(connections?.length);
    }, [newRequest, conversationRequest, conversationCount, connections]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpenOptionsConversationId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [containerRef]);

    const handleToggleConnections = () => {
        setShowConnections(true);
        setShowRequests(false);
    };

    const handleToggleRequests = () => {
        setShowConnections(false);
        setShowRequests(true);
    };

    const accepthandler = (conversation) => {
        const requestId = conversation?.members?.find((m) => m?._id !== props?._id);
        dispatch(conversationRequestAccept(requestId?._id));
    };

    const declinehandler = (conversation) => {
        const requestId = conversation?.members?.find((m) => m?._id !== props?._id);
        dispatch(conversationRequestDecline(requestId?._id));
    };

    const removehandler = (conversation) => {
        dispatch(conversationRemove(conversation?._id));
    };

    const NewRequestCard = ({ c, id }) => {
        const otherUser = c?.members?.find((m) => m?._id !== id);
        return (
            <>
                <section className='flex items-center mt-2 justify-between'>
                    <div className='flex items-center'>
                        {otherUser?.basicInfo?.profileImg ? (
                            <img className='rounded-full w-12 h-12 me-3' src={otherUser?.basicInfo?.profileImg} alt="Profile" />
                        ) : (
                            <div className='rounded-full w-12 h-12 me-3 flex justify-center items-center bg-slate-300'>
                                <span className='capitalize text-lg'>
                                    {otherUser?.fullName[0]}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className='text-gray-700 font-semibold text-base'>{otherUser?.fullName}</h3>
                            <h3 className='text-gray-500 font-normal text-sm'>{otherUser?.basicInfo?.designation || 'N/A'}</h3>
                        </div>
                    </div>
                    <div className='flex'>
                        <h3 onClick={() => accepthandler(c)} className='hover:underline me-5 text-blue-500 font-semibold text-sm cursor-pointer'>Accept</h3>
                        <h3 onClick={() => declinehandler(c)} className='hover:underline me-5 text-blue-500 font-semibold text-sm cursor-pointer'>Decline</h3>
                    </div>
                </section>
                <hr className='mt-[5px]' />
            </>
        );
    };

    const ConversationCard = ({ c, id, index }) => {
        const otherUser = c?.members?.find((m) => m?._id !== id);
        const handleToggleOptions = (conversationId) => {
            setOpenOptionsConversationId(prevId => (prevId === conversationId ? null : conversationId));
        };
        return (
            <>
                <section className='flex items-center mt-2 justify-between relative'>
                    <div className='flex items-center'>
                        {otherUser?.basicInfo?.profileImg ? (
                            <img className='rounded-full w-12 h-12 me-3' src={otherUser?.basicInfo?.profileImg} alt='profile' />
                        ) : (
                            <div className='rounded-full w-12 h-12 me-3 flex justify-center items-center bg-slate-300'>
                                <span className='capitalize'>
                                    {otherUser?.fullName[0]}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className='text-gray-700 font-semibold text-base'>{otherUser?.fullName}</h3>
                            <h3 className='text-gray-500 font-normal text-sm'>{otherUser?.basicInfo?.designation || 'N/A'}</h3>
                        </div>
                    </div>
                    <div className='flex gap-3 justify-center items-center'>
                        <Link to={`/employerDashboard/messages`}>
                            <h3 className='hover:underline text-blue-500 font-semibold text-sm cursor-pointer'>Message</h3>
                        </Link>
                        <h3 className='me-5 text-blue-500 font-semibold text-sm cursor-pointer' onClick={() => handleToggleOptions(c?._id)}>⋮</h3>
                        {openOptionsConversationId === c?._id && (
                            <div ref={containerRef} className="fixed bg-gray-200 rounded-lg z-5000 ml-56 mt-10">
                                <Link to={`/employerDashboard/trainerlist/trainerlistprofile/${otherUser?._id}`}>
                                    <h3 className='text-[#2676C2] font-semibold text-sm cursor-pointer  p-1 hover:bg-gray-300 rounded-lg'>View Profile</h3>
                                </Link>
                                <h3 onClick={() => removehandler(c)} className='text-red-500 font-semibold text-sm cursor-pointer p-1 hover:bg-gray-300 rounded-lg'>Remove Connection</h3>
                            </div>
                        )}
                    </div>
                </section>
                <hr className='mt-[5px]' />
            </>
        );
    };

    return props.trigger ? (
        <div className="ConnectionPop flex justify-center items-center h-screen">
            <div className='w-full max-w-[50%] h-[80vh] p-[20px] border border-gray-300 bg-[#ffff] rounded-[10px]'>
                <section className='flex justify-between items-center pb-2'>
                    <h3 className={`text-blue-500 font-semibold text-sm cursor-pointer p-1 rounded-[10px] flex justify-center items-center gap-2 ${showRequests ? '' : 'bg-blue-200'}`} onClick={handleToggleConnections}>
                        Connections <span className='w-4 h-4 flex justify-center items-center text-sm bg-blue-500 text-[#ffff] rounded-full'>{conversationCount || 0}</span>
                    </h3>
                    <div className='flex items-center'>
                        <h3 className={`text-blue-500 font-semibold text-sm me-3 cursor-pointer p-1 rounded-[10px] ${showConnections ? '' : 'bg-blue-200'}`} onClick={handleToggleRequests}>
                            New request ({newRequest || 0})
                        </h3>
                        <span className='hover:bg-blue-100 rounded-full p-1' onClick={() => props.setTrigger(false)}>
                            <svg className="popconnection cursor-pointer rounded-full" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 34 34" fill="none">
                                <path d="M8.48542 8.48528L16.9707 16.9706M16.9707 16.9706L25.456 25.4558M16.9707 16.9706L8.48542 25.4558M16.9707 16.9706L25.456 8.48528" stroke="#2676C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </section>
                <hr />
                <section>
                    {showConnections && (
                        <div className='connectionScroll overflow-y-scroll max-h-[90vh]'>
                            {connections?.length > 0 ? (
                                connections?.map((c, index) => <ConversationCard key={index} c={c} id={props?.id} index={index} />)
                            ) : (
                                <p className='text-center text-sm text-gray-600 py-4'>No connections yet.</p>
                            )}
                        </div>
                    )}
                    {showRequests && (
                        <div>
                            {conversationRequest?.length > 0 ? (
                                conversationRequest?.map((c) => (
                                    <div key={c._id} onClick={() => setSelectedConversation(c)}>
                                        <NewRequestCard c={c} id={props?.id} />
                                    </div>
                                ))
                            ) : (
                                <p className='text-center text-sm text-gray-600 py-4'>No requests yet.</p>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    ) : null;
};

export default EmployerConnectionPopUp;
