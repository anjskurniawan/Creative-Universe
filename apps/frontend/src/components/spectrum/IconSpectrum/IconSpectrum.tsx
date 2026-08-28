"use client";

import type { ComponentType } from "react";
import S2Icon_3D from "@react-spectrum/s2/icons/3D";
import S2Icon_3DAsset from "@react-spectrum/s2/icons/3DAsset";
import S2Icon_3DMaterial from "@react-spectrum/s2/icons/3DMaterial";
import S2Icon_ABC from "@react-spectrum/s2/icons/ABC";
import S2Icon_Accessibility from "@react-spectrum/s2/icons/Accessibility";
import S2Icon_Add from "@react-spectrum/s2/icons/Add";
import S2Icon_AddCircle from "@react-spectrum/s2/icons/AddCircle";
import S2Icon_AddContent from "@react-spectrum/s2/icons/AddContent";
import S2Icon_AlertDiamond from "@react-spectrum/s2/icons/AlertDiamond";
import S2Icon_AlertTriangle from "@react-spectrum/s2/icons/AlertTriangle";
import S2Icon_AlignBottom from "@react-spectrum/s2/icons/AlignBottom";
import S2Icon_AlignCenter from "@react-spectrum/s2/icons/AlignCenter";
import S2Icon_AlignLeft from "@react-spectrum/s2/icons/AlignLeft";
import S2Icon_AlignMiddle from "@react-spectrum/s2/icons/AlignMiddle";
import S2Icon_AlignRight from "@react-spectrum/s2/icons/AlignRight";
import S2Icon_AlignTop from "@react-spectrum/s2/icons/AlignTop";
import S2Icon_Animation from "@react-spectrum/s2/icons/Animation";
import S2Icon_AnimationNo from "@react-spectrum/s2/icons/AnimationNo";
import S2Icon_App from "@react-spectrum/s2/icons/App";
import S2Icon_Apps from "@react-spectrum/s2/icons/Apps";
import S2Icon_AppsAll from "@react-spectrum/s2/icons/AppsAll";
import S2Icon_Archive from "@react-spectrum/s2/icons/Archive";
import S2Icon_ArrowCurved from "@react-spectrum/s2/icons/ArrowCurved";
import S2Icon_ArrowHeadTool from "@react-spectrum/s2/icons/ArrowHeadTool";
import S2Icon_ArrowUpSend from "@react-spectrum/s2/icons/ArrowUpSend";
import S2Icon_Artboard from "@react-spectrum/s2/icons/Artboard";
import S2Icon_AspectRatio from "@react-spectrum/s2/icons/AspectRatio";
import S2Icon_Asset from "@react-spectrum/s2/icons/Asset";
import S2Icon_Attach from "@react-spectrum/s2/icons/Attach";
import S2Icon_AudioWave from "@react-spectrum/s2/icons/AudioWave";
import S2Icon_AutoSelectSubject from "@react-spectrum/s2/icons/AutoSelectSubject";
import S2Icon_Background from "@react-spectrum/s2/icons/Background";
import S2Icon_BadgeVerified from "@react-spectrum/s2/icons/BadgeVerified";
import S2Icon_Bell from "@react-spectrum/s2/icons/Bell";
import S2Icon_BellRotated from "@react-spectrum/s2/icons/BellRotated";
import S2Icon_BetaApp from "@react-spectrum/s2/icons/BetaApp";
import S2Icon_Binoculars from "@react-spectrum/s2/icons/Binoculars";
import S2Icon_Blur from "@react-spectrum/s2/icons/Blur";
import S2Icon_Bookmark from "@react-spectrum/s2/icons/Bookmark";
import S2Icon_BookmarkSingleFilled from "@react-spectrum/s2/icons/BookmarkSingleFilled";
import S2Icon_Brand from "@react-spectrum/s2/icons/Brand";
import S2Icon_Briefcase from "@react-spectrum/s2/icons/Briefcase";
import S2Icon_BrightnessContrast from "@react-spectrum/s2/icons/BrightnessContrast";
import S2Icon_Brush from "@react-spectrum/s2/icons/Brush";
import S2Icon_Bug from "@react-spectrum/s2/icons/Bug";
import S2Icon_Building from "@react-spectrum/s2/icons/Building";
import S2Icon_Buildings from "@react-spectrum/s2/icons/Buildings";
import S2Icon_Calendar from "@react-spectrum/s2/icons/Calendar";
import S2Icon_CalendarAdd from "@react-spectrum/s2/icons/CalendarAdd";
import S2Icon_CalendarDay from "@react-spectrum/s2/icons/CalendarDay";
import S2Icon_CalendarEdit from "@react-spectrum/s2/icons/CalendarEdit";
import S2Icon_CalendarWeek from "@react-spectrum/s2/icons/CalendarWeek";
import S2Icon_CallCenter from "@react-spectrum/s2/icons/CallCenter";
import S2Icon_Camera from "@react-spectrum/s2/icons/Camera";
import S2Icon_CameraProperties from "@react-spectrum/s2/icons/CameraProperties";
import S2Icon_Cancel from "@react-spectrum/s2/icons/Cancel";
import S2Icon_CCLibrary from "@react-spectrum/s2/icons/CCLibrary";
import S2Icon_Channel from "@react-spectrum/s2/icons/Channel";
import S2Icon_ChartBarVert from "@react-spectrum/s2/icons/ChartBarVert";
import S2Icon_ChartPie from "@react-spectrum/s2/icons/ChartPie";
import S2Icon_ChartTrend from "@react-spectrum/s2/icons/ChartTrend";
import S2Icon_Chat from "@react-spectrum/s2/icons/Chat";
import S2Icon_CheckBox from "@react-spectrum/s2/icons/CheckBox";
import S2Icon_Checkmark from "@react-spectrum/s2/icons/Checkmark";
import S2Icon_CheckmarkCircle from "@react-spectrum/s2/icons/CheckmarkCircle";
import S2Icon_ChevronDoubleLeft from "@react-spectrum/s2/icons/ChevronDoubleLeft";
import S2Icon_ChevronDoubleRight from "@react-spectrum/s2/icons/ChevronDoubleRight";
import S2Icon_ChevronDown from "@react-spectrum/s2/icons/ChevronDown";
import S2Icon_ChevronLeft from "@react-spectrum/s2/icons/ChevronLeft";
import S2Icon_ChevronRight from "@react-spectrum/s2/icons/ChevronRight";
import S2Icon_ChevronUp from "@react-spectrum/s2/icons/ChevronUp";
import S2Icon_Circle from "@react-spectrum/s2/icons/Circle";
import S2Icon_Clock from "@react-spectrum/s2/icons/Clock";
import S2Icon_ClockPending from "@react-spectrum/s2/icons/ClockPending";
import S2Icon_Close from "@react-spectrum/s2/icons/Close";
import S2Icon_CloseCaptions from "@react-spectrum/s2/icons/CloseCaptions";
import S2Icon_CloseCircle from "@react-spectrum/s2/icons/CloseCircle";
import S2Icon_Cloud from "@react-spectrum/s2/icons/Cloud";
import S2Icon_CloudStateDisconnected from "@react-spectrum/s2/icons/CloudStateDisconnected";
import S2Icon_CloudStateError from "@react-spectrum/s2/icons/CloudStateError";
import S2Icon_CloudStateInProgress from "@react-spectrum/s2/icons/CloudStateInProgress";
import S2Icon_CloudStateOnline from "@react-spectrum/s2/icons/CloudStateOnline";
import S2Icon_CloudStatePaused from "@react-spectrum/s2/icons/CloudStatePaused";
import S2Icon_CloudStatePending from "@react-spectrum/s2/icons/CloudStatePending";
import S2Icon_CloudStateSlowConnection from "@react-spectrum/s2/icons/CloudStateSlowConnection";
import S2Icon_Code from "@react-spectrum/s2/icons/Code";
import S2Icon_Collection from "@react-spectrum/s2/icons/Collection";
import S2Icon_Color from "@react-spectrum/s2/icons/Color";
import S2Icon_ColorFill from "@react-spectrum/s2/icons/ColorFill";
import S2Icon_ColorHarmony from "@react-spectrum/s2/icons/ColorHarmony";
import S2Icon_Comment from "@react-spectrum/s2/icons/Comment";
import S2Icon_CommentCheckmark from "@react-spectrum/s2/icons/CommentCheckmark";
import S2Icon_CommentHide from "@react-spectrum/s2/icons/CommentHide";
import S2Icon_CommentRemove from "@react-spectrum/s2/icons/CommentRemove";
import S2Icon_CommentShow from "@react-spectrum/s2/icons/CommentShow";
import S2Icon_CommentText from "@react-spectrum/s2/icons/CommentText";
import S2Icon_Community from "@react-spectrum/s2/icons/Community";
import S2Icon_Compare from "@react-spectrum/s2/icons/Compare";
import S2Icon_ContextualTaskBar from "@react-spectrum/s2/icons/ContextualTaskBar";
import S2Icon_Contrast from "@react-spectrum/s2/icons/Contrast";
import S2Icon_Copy from "@react-spectrum/s2/icons/Copy";
import S2Icon_CornerRadius from "@react-spectrum/s2/icons/CornerRadius";
import S2Icon_CornerRadiusBottomLeft from "@react-spectrum/s2/icons/CornerRadiusBottomLeft";
import S2Icon_CornerRadiusBottomRight from "@react-spectrum/s2/icons/CornerRadiusBottomRight";
import S2Icon_CornerRadiusEach from "@react-spectrum/s2/icons/CornerRadiusEach";
import S2Icon_CornerRadiusTopLeft from "@react-spectrum/s2/icons/CornerRadiusTopLeft";
import S2Icon_CornerRadiusTopRight from "@react-spectrum/s2/icons/CornerRadiusTopRight";
import S2Icon_Crop from "@react-spectrum/s2/icons/Crop";
import S2Icon_CropRotate from "@react-spectrum/s2/icons/CropRotate";
import S2Icon_CursorClick from "@react-spectrum/s2/icons/CursorClick";
import S2Icon_Cut from "@react-spectrum/s2/icons/Cut";
import S2Icon_Data from "@react-spectrum/s2/icons/Data";
import S2Icon_DataAdd from "@react-spectrum/s2/icons/DataAdd";
import S2Icon_DataRefresh from "@react-spectrum/s2/icons/DataRefresh";
import S2Icon_DataSettings from "@react-spectrum/s2/icons/DataSettings";
import S2Icon_DataUpload from "@react-spectrum/s2/icons/DataUpload";
import S2Icon_Delete from "@react-spectrum/s2/icons/Delete";
import S2Icon_DeviceAll from "@react-spectrum/s2/icons/DeviceAll";
import S2Icon_DeviceDesktop from "@react-spectrum/s2/icons/DeviceDesktop";
import S2Icon_DeviceDesktopMobile from "@react-spectrum/s2/icons/DeviceDesktopMobile";
import S2Icon_DeviceLaptop from "@react-spectrum/s2/icons/DeviceLaptop";
import S2Icon_DeviceMobile from "@react-spectrum/s2/icons/DeviceMobile";
import S2Icon_DeviceMultiscreen from "@react-spectrum/s2/icons/DeviceMultiscreen";
import S2Icon_DevicePhone from "@react-spectrum/s2/icons/DevicePhone";
import S2Icon_DeviceTablet from "@react-spectrum/s2/icons/DeviceTablet";
import S2Icon_DirectSelect from "@react-spectrum/s2/icons/DirectSelect";
import S2Icon_Discover from "@react-spectrum/s2/icons/Discover";
import S2Icon_DistributeBottomEdge from "@react-spectrum/s2/icons/DistributeBottomEdge";
import S2Icon_DistributeHorizontalCenter from "@react-spectrum/s2/icons/DistributeHorizontalCenter";
import S2Icon_DistributeLeftEdge from "@react-spectrum/s2/icons/DistributeLeftEdge";
import S2Icon_DistributeRightEdge from "@react-spectrum/s2/icons/DistributeRightEdge";
import S2Icon_DistributeSpaceHorizontally from "@react-spectrum/s2/icons/DistributeSpaceHorizontally";
import S2Icon_DistributeSpaceVertically from "@react-spectrum/s2/icons/DistributeSpaceVertically";
import S2Icon_DistributeTopEdge from "@react-spectrum/s2/icons/DistributeTopEdge";
import S2Icon_DistributeVerticalCenter from "@react-spectrum/s2/icons/DistributeVerticalCenter";
import S2Icon_Download from "@react-spectrum/s2/icons/Download";
import S2Icon_Draw from "@react-spectrum/s2/icons/Draw";
import S2Icon_Duplicate from "@react-spectrum/s2/icons/Duplicate";
import S2Icon_Edit from "@react-spectrum/s2/icons/Edit";
import S2Icon_EditNo from "@react-spectrum/s2/icons/EditNo";
import S2Icon_Education from "@react-spectrum/s2/icons/Education";
import S2Icon_EffectBorder from "@react-spectrum/s2/icons/EffectBorder";
import S2Icon_Effects from "@react-spectrum/s2/icons/Effects";
import S2Icon_Email from "@react-spectrum/s2/icons/Email";
import S2Icon_Emoji from "@react-spectrum/s2/icons/Emoji";
import S2Icon_Enterprise from "@react-spectrum/s2/icons/Enterprise";
import S2Icon_Erase from "@react-spectrum/s2/icons/Erase";
import S2Icon_Export from "@react-spectrum/s2/icons/Export";
import S2Icon_ExportTo from "@react-spectrum/s2/icons/ExportTo";
import S2Icon_Exposure from "@react-spectrum/s2/icons/Exposure";
import S2Icon_Eyedropper from "@react-spectrum/s2/icons/Eyedropper";
import S2Icon_Feedback from "@react-spectrum/s2/icons/Feedback";
import S2Icon_File from "@react-spectrum/s2/icons/File";
import S2Icon_FileAdd from "@react-spectrum/s2/icons/FileAdd";
import S2Icon_FileConvert from "@react-spectrum/s2/icons/FileConvert";
import S2Icon_Files from "@react-spectrum/s2/icons/Files";
import S2Icon_FileText from "@react-spectrum/s2/icons/FileText";
import S2Icon_FileUser from "@react-spectrum/s2/icons/FileUser";
import S2Icon_Filmstrip from "@react-spectrum/s2/icons/Filmstrip";
import S2Icon_Filter from "@react-spectrum/s2/icons/Filter";
import S2Icon_Filters from "@react-spectrum/s2/icons/Filters";
import S2Icon_FindAndReplace from "@react-spectrum/s2/icons/FindAndReplace";
import S2Icon_Flag from "@react-spectrum/s2/icons/Flag";
import S2Icon_FlipHorizontal from "@react-spectrum/s2/icons/FlipHorizontal";
import S2Icon_FlipVertical from "@react-spectrum/s2/icons/FlipVertical";
import S2Icon_Folder from "@react-spectrum/s2/icons/Folder";
import S2Icon_FolderAdd from "@react-spectrum/s2/icons/FolderAdd";
import S2Icon_FolderBreadcrumb from "@react-spectrum/s2/icons/FolderBreadcrumb";
import S2Icon_FolderClock from "@react-spectrum/s2/icons/FolderClock";
import S2Icon_FolderMoveTo from "@react-spectrum/s2/icons/FolderMoveTo";
import S2Icon_FolderOpen from "@react-spectrum/s2/icons/FolderOpen";
import S2Icon_FolderSearch from "@react-spectrum/s2/icons/FolderSearch";
import S2Icon_FontPicker from "@react-spectrum/s2/icons/FontPicker";
import S2Icon_FullScreen from "@react-spectrum/s2/icons/FullScreen";
import S2Icon_FullScreenExit from "@react-spectrum/s2/icons/FullScreenExit";
import S2Icon_Gift from "@react-spectrum/s2/icons/Gift";
import S2Icon_GlobeGrid from "@react-spectrum/s2/icons/GlobeGrid";
import S2Icon_Gradient from "@react-spectrum/s2/icons/Gradient";
import S2Icon_GradientHorizontal from "@react-spectrum/s2/icons/GradientHorizontal";
import S2Icon_GradientRadial from "@react-spectrum/s2/icons/GradientRadial";
import S2Icon_GridsAndRulers from "@react-spectrum/s2/icons/GridsAndRulers";
import S2Icon_GridTypeDots from "@react-spectrum/s2/icons/GridTypeDots";
import S2Icon_GridTypeLines from "@react-spectrum/s2/icons/GridTypeLines";
import S2Icon_Group from "@react-spectrum/s2/icons/Group";
import S2Icon_GroupNo from "@react-spectrum/s2/icons/GroupNo";
import S2Icon_Hand from "@react-spectrum/s2/icons/Hand";
import S2Icon_Heart from "@react-spectrum/s2/icons/Heart";
import S2Icon_HeartFilled from "@react-spectrum/s2/icons/HeartFilled";
import S2Icon_HelpCircle from "@react-spectrum/s2/icons/HelpCircle";
import S2Icon_History from "@react-spectrum/s2/icons/History";
import S2Icon_Home from "@react-spectrum/s2/icons/Home";
import S2Icon_Image from "@react-spectrum/s2/icons/Image";
import S2Icon_ImageAdd from "@react-spectrum/s2/icons/ImageAdd";
import S2Icon_ImageBackgroundRemove from "@react-spectrum/s2/icons/ImageBackgroundRemove";
import S2Icon_Images from "@react-spectrum/s2/icons/Images";
import S2Icon_Import from "@react-spectrum/s2/icons/Import";
import S2Icon_InfoCircle from "@react-spectrum/s2/icons/InfoCircle";
import S2Icon_Interaction from "@react-spectrum/s2/icons/Interaction";
import S2Icon_Invert from "@react-spectrum/s2/icons/Invert";
import S2Icon_Invite from "@react-spectrum/s2/icons/Invite";
import S2Icon_Key from "@react-spectrum/s2/icons/Key";
import S2Icon_Keyboard from "@react-spectrum/s2/icons/Keyboard";
import S2Icon_LassoSelect from "@react-spectrum/s2/icons/LassoSelect";
import S2Icon_Layers from "@react-spectrum/s2/icons/Layers";
import S2Icon_Layout from "@react-spectrum/s2/icons/Layout";
import S2Icon_Leave from "@react-spectrum/s2/icons/Leave";
import S2Icon_Lightbulb from "@react-spectrum/s2/icons/Lightbulb";
import S2Icon_Lighten from "@react-spectrum/s2/icons/Lighten";
import S2Icon_Line from "@react-spectrum/s2/icons/Line";
import S2Icon_LineHeight from "@react-spectrum/s2/icons/LineHeight";
import S2Icon_Link from "@react-spectrum/s2/icons/Link";
import S2Icon_LinkVertical from "@react-spectrum/s2/icons/LinkVertical";
import S2Icon_ListBulleted from "@react-spectrum/s2/icons/ListBulleted";
import S2Icon_ListMultiSelect from "@react-spectrum/s2/icons/ListMultiSelect";
import S2Icon_ListNumbered from "@react-spectrum/s2/icons/ListNumbered";
import S2Icon_Location from "@react-spectrum/s2/icons/Location";
import S2Icon_Lock from "@react-spectrum/s2/icons/Lock";
import S2Icon_LockOpen from "@react-spectrum/s2/icons/LockOpen";
import S2Icon_Logo from "@react-spectrum/s2/icons/Logo";
import S2Icon_MagicWand from "@react-spectrum/s2/icons/MagicWand";
import S2Icon_Market from "@react-spectrum/s2/icons/Market";
import S2Icon_Mask from "@react-spectrum/s2/icons/Mask";
import S2Icon_MaskDisable from "@react-spectrum/s2/icons/MaskDisable";
import S2Icon_Maximize from "@react-spectrum/s2/icons/Maximize";
import S2Icon_MediaOffline from "@react-spectrum/s2/icons/MediaOffline";
import S2Icon_Mention from "@react-spectrum/s2/icons/Mention";
import S2Icon_MenuHamburger from "@react-spectrum/s2/icons/MenuHamburger";
import S2Icon_Microphone from "@react-spectrum/s2/icons/Microphone";
import S2Icon_MicrophoneOff from "@react-spectrum/s2/icons/MicrophoneOff";
import S2Icon_Minimize from "@react-spectrum/s2/icons/Minimize";
import S2Icon_More from "@react-spectrum/s2/icons/More";
import S2Icon_Move from "@react-spectrum/s2/icons/Move";
import S2Icon_MovieCamera from "@react-spectrum/s2/icons/MovieCamera";
import S2Icon_MusicNote from "@react-spectrum/s2/icons/MusicNote";
import S2Icon_NamingOrder from "@react-spectrum/s2/icons/NamingOrder";
import S2Icon_New from "@react-spectrum/s2/icons/New";
import S2Icon_Nudge from "@react-spectrum/s2/icons/Nudge";
import S2Icon_OpenIn from "@react-spectrum/s2/icons/OpenIn";
import S2Icon_Order from "@react-spectrum/s2/icons/Order";
import S2Icon_OrderBottom from "@react-spectrum/s2/icons/OrderBottom";
import S2Icon_OrderOneDown from "@react-spectrum/s2/icons/OrderOneDown";
import S2Icon_OrderOneUp from "@react-spectrum/s2/icons/OrderOneUp";
import S2Icon_OrderTop from "@react-spectrum/s2/icons/OrderTop";
import S2Icon_OrientationLandscape from "@react-spectrum/s2/icons/OrientationLandscape";
import S2Icon_OrientationPortrait from "@react-spectrum/s2/icons/OrientationPortrait";
import S2Icon_Paste from "@react-spectrum/s2/icons/Paste";
import S2Icon_Path from "@react-spectrum/s2/icons/Path";
import S2Icon_Pattern from "@react-spectrum/s2/icons/Pattern";
import S2Icon_Pause from "@react-spectrum/s2/icons/Pause";
import S2Icon_PauseCircle from "@react-spectrum/s2/icons/PauseCircle";
import S2Icon_PenBrush from "@react-spectrum/s2/icons/PenBrush";
import S2Icon_People from "@react-spectrum/s2/icons/People";
import S2Icon_PeopleGroup from "@react-spectrum/s2/icons/PeopleGroup";
import S2Icon_Percentage from "@react-spectrum/s2/icons/Percentage";
import S2Icon_PinOff from "@react-spectrum/s2/icons/PinOff";
import S2Icon_PinOn from "@react-spectrum/s2/icons/PinOn";
import S2Icon_Play from "@react-spectrum/s2/icons/Play";
import S2Icon_Plugin from "@react-spectrum/s2/icons/Plugin";
import S2Icon_PluginGear from "@react-spectrum/s2/icons/PluginGear";
import S2Icon_Polygon3 from "@react-spectrum/s2/icons/Polygon3";
import S2Icon_Polygon4 from "@react-spectrum/s2/icons/Polygon4";
import S2Icon_Polygon5 from "@react-spectrum/s2/icons/Polygon5";
import S2Icon_Polygon6 from "@react-spectrum/s2/icons/Polygon6";
import S2Icon_PremiumIcon from "@react-spectrum/s2/icons/PremiumIcon";
import S2Icon_Preview from "@react-spectrum/s2/icons/Preview";
import S2Icon_Print from "@react-spectrum/s2/icons/Print";
import S2Icon_Project from "@react-spectrum/s2/icons/Project";
import S2Icon_ProjectAddInto from "@react-spectrum/s2/icons/ProjectAddInto";
import S2Icon_ProjectCreate from "@react-spectrum/s2/icons/ProjectCreate";
import S2Icon_Promote from "@react-spectrum/s2/icons/Promote";
import S2Icon_Prompt from "@react-spectrum/s2/icons/Prompt";
import S2Icon_Properties from "@react-spectrum/s2/icons/Properties";
import S2Icon_Prototyping from "@react-spectrum/s2/icons/Prototyping";
import S2Icon_Publish from "@react-spectrum/s2/icons/Publish";
import S2Icon_PublishNo from "@react-spectrum/s2/icons/PublishNo";
import S2Icon_RadioButton from "@react-spectrum/s2/icons/RadioButton";
import S2Icon_RectangleHoriz from "@react-spectrum/s2/icons/RectangleHoriz";
import S2Icon_Redo from "@react-spectrum/s2/icons/Redo";
import S2Icon_Refresh from "@react-spectrum/s2/icons/Refresh";
import S2Icon_RemoveCircle from "@react-spectrum/s2/icons/RemoveCircle";
import S2Icon_Rename from "@react-spectrum/s2/icons/Rename";
import S2Icon_Replace from "@react-spectrum/s2/icons/Replace";
import S2Icon_ReportAbuse from "@react-spectrum/s2/icons/ReportAbuse";
import S2Icon_Resize from "@react-spectrum/s2/icons/Resize";
import S2Icon_Revert from "@react-spectrum/s2/icons/Revert";
import S2Icon_ReviewLink from "@react-spectrum/s2/icons/ReviewLink";
import S2Icon_Ribbon from "@react-spectrum/s2/icons/Ribbon";
import S2Icon_RocketQuickActions from "@react-spectrum/s2/icons/RocketQuickActions";
import S2Icon_RotateCCW from "@react-spectrum/s2/icons/RotateCCW";
import S2Icon_RotateCW from "@react-spectrum/s2/icons/RotateCW";
import S2Icon_RotateOrientation from "@react-spectrum/s2/icons/RotateOrientation";
import S2Icon_Ruler from "@react-spectrum/s2/icons/Ruler";
import S2Icon_Saturation from "@react-spectrum/s2/icons/Saturation";
import S2Icon_SaveFloppy from "@react-spectrum/s2/icons/SaveFloppy";
import S2Icon_Search from "@react-spectrum/s2/icons/Search";
import S2Icon_Select from "@react-spectrum/s2/icons/Select";
import S2Icon_SelectAllItems from "@react-spectrum/s2/icons/SelectAllItems";
import S2Icon_SelectAndMove from "@react-spectrum/s2/icons/SelectAndMove";
import S2Icon_SelectMulti from "@react-spectrum/s2/icons/SelectMulti";
import S2Icon_SelectNo from "@react-spectrum/s2/icons/SelectNo";
import S2Icon_SelectNone from "@react-spectrum/s2/icons/SelectNone";
import S2Icon_SelectRectangle from "@react-spectrum/s2/icons/SelectRectangle";
import S2Icon_Send from "@react-spectrum/s2/icons/Send";
import S2Icon_Settings from "@react-spectrum/s2/icons/Settings";
import S2Icon_Shapes from "@react-spectrum/s2/icons/Shapes";
import S2Icon_Share from "@react-spectrum/s2/icons/Share";
import S2Icon_ShareAndroid from "@react-spectrum/s2/icons/ShareAndroid";
import S2Icon_ShoppingCart from "@react-spectrum/s2/icons/ShoppingCart";
import S2Icon_Shuffle from "@react-spectrum/s2/icons/Shuffle";
import S2Icon_Similar from "@react-spectrum/s2/icons/Similar";
import S2Icon_Slideshow from "@react-spectrum/s2/icons/Slideshow";
import S2Icon_SlowConnectionCircle from "@react-spectrum/s2/icons/SlowConnectionCircle";
import S2Icon_SocialNetwork from "@react-spectrum/s2/icons/SocialNetwork";
import S2Icon_Sort from "@react-spectrum/s2/icons/Sort";
import S2Icon_SortDown from "@react-spectrum/s2/icons/SortDown";
import S2Icon_SortUp from "@react-spectrum/s2/icons/SortUp";
import S2Icon_SpeedFast from "@react-spectrum/s2/icons/SpeedFast";
import S2Icon_StampClone from "@react-spectrum/s2/icons/StampClone";
import S2Icon_Star from "@react-spectrum/s2/icons/Star";
import S2Icon_StarFilled from "@react-spectrum/s2/icons/StarFilled";
import S2Icon_StepBackward from "@react-spectrum/s2/icons/StepBackward";
import S2Icon_StepForward from "@react-spectrum/s2/icons/StepForward";
import S2Icon_StickyNote from "@react-spectrum/s2/icons/StickyNote";
import S2Icon_StopProcessing from "@react-spectrum/s2/icons/StopProcessing";
import S2Icon_StrokeDotted from "@react-spectrum/s2/icons/StrokeDotted";
import S2Icon_StrokeSolid from "@react-spectrum/s2/icons/StrokeSolid";
import S2Icon_StrokeWidth from "@react-spectrum/s2/icons/StrokeWidth";
import S2Icon_Switch from "@react-spectrum/s2/icons/Switch";
import S2Icon_SwitchVertical from "@react-spectrum/s2/icons/SwitchVertical";
import S2Icon_Table from "@react-spectrum/s2/icons/Table";
import S2Icon_Tag from "@react-spectrum/s2/icons/Tag";
import S2Icon_TagBold from "@react-spectrum/s2/icons/TagBold";
import S2Icon_TagItalic from "@react-spectrum/s2/icons/TagItalic";
import S2Icon_TagStrikeThrough from "@react-spectrum/s2/icons/TagStrikeThrough";
import S2Icon_TagUnderline from "@react-spectrum/s2/icons/TagUnderline";
import S2Icon_Target from "@react-spectrum/s2/icons/Target";
import S2Icon_Temperature from "@react-spectrum/s2/icons/Temperature";
import S2Icon_Template from "@react-spectrum/s2/icons/Template";
import S2Icon_Text from "@react-spectrum/s2/icons/Text";
import S2Icon_TextAdd from "@react-spectrum/s2/icons/TextAdd";
import S2Icon_TextAlignCenter from "@react-spectrum/s2/icons/TextAlignCenter";
import S2Icon_TextAlignJustify from "@react-spectrum/s2/icons/TextAlignJustify";
import S2Icon_TextAlignJustifyLastCenter from "@react-spectrum/s2/icons/TextAlignJustifyLastCenter";
import S2Icon_TextAlignJustifyLastLeft from "@react-spectrum/s2/icons/TextAlignJustifyLastLeft";
import S2Icon_TextAlignJustifyLastRight from "@react-spectrum/s2/icons/TextAlignJustifyLastRight";
import S2Icon_TextAlignLeft from "@react-spectrum/s2/icons/TextAlignLeft";
import S2Icon_TextAlignRight from "@react-spectrum/s2/icons/TextAlignRight";
import S2Icon_TextBold from "@react-spectrum/s2/icons/TextBold";
import S2Icon_TextCapsAll from "@react-spectrum/s2/icons/TextCapsAll";
import S2Icon_TextCapsSmall from "@react-spectrum/s2/icons/TextCapsSmall";
import S2Icon_TextHighlight from "@react-spectrum/s2/icons/TextHighlight";
import S2Icon_TextIncrease from "@react-spectrum/s2/icons/TextIncrease";
import S2Icon_TextItalic from "@react-spectrum/s2/icons/TextItalic";
import S2Icon_TextNumbers from "@react-spectrum/s2/icons/TextNumbers";
import S2Icon_TextParagraph from "@react-spectrum/s2/icons/TextParagraph";
import S2Icon_TextReplaceComment from "@react-spectrum/s2/icons/TextReplaceComment";
import S2Icon_TextSize from "@react-spectrum/s2/icons/TextSize";
import S2Icon_TextStrikeThrough from "@react-spectrum/s2/icons/TextStrikeThrough";
import S2Icon_TextSubscript from "@react-spectrum/s2/icons/TextSubscript";
import S2Icon_TextSuperscript from "@react-spectrum/s2/icons/TextSuperscript";
import S2Icon_TextUnderline from "@react-spectrum/s2/icons/TextUnderline";
import S2Icon_TextVariableFontSettings from "@react-spectrum/s2/icons/TextVariableFontSettings";
import S2Icon_ThumbDown from "@react-spectrum/s2/icons/ThumbDown";
import S2Icon_ThumbUp from "@react-spectrum/s2/icons/ThumbUp";
import S2Icon_Toggle from "@react-spectrum/s2/icons/Toggle";
import S2Icon_Tools from "@react-spectrum/s2/icons/Tools";
import S2Icon_TouchOneFingerSwipeLeftRight from "@react-spectrum/s2/icons/TouchOneFingerSwipeLeftRight";
import S2Icon_Transcript from "@react-spectrum/s2/icons/Transcript";
import S2Icon_TransformDistort from "@react-spectrum/s2/icons/TransformDistort";
import S2Icon_TransformGeneric from "@react-spectrum/s2/icons/TransformGeneric";
import S2Icon_TransformPerspective from "@react-spectrum/s2/icons/TransformPerspective";
import S2Icon_TransformSkew from "@react-spectrum/s2/icons/TransformSkew";
import S2Icon_TransformWarp from "@react-spectrum/s2/icons/TransformWarp";
import S2Icon_Translate from "@react-spectrum/s2/icons/Translate";
import S2Icon_Tutorials from "@react-spectrum/s2/icons/Tutorials";
import S2Icon_Undo from "@react-spectrum/s2/icons/Undo";
import S2Icon_UnLink from "@react-spectrum/s2/icons/UnLink";
import S2Icon_UnlinkHoriz from "@react-spectrum/s2/icons/UnlinkHoriz";
import S2Icon_UnlinkVertical from "@react-spectrum/s2/icons/UnlinkVertical";
import S2Icon_Upload from "@react-spectrum/s2/icons/Upload";
import S2Icon_UploadToCloud from "@react-spectrum/s2/icons/UploadToCloud";
import S2Icon_User from "@react-spectrum/s2/icons/User";
import S2Icon_UserAdd from "@react-spectrum/s2/icons/UserAdd";
import S2Icon_UserAvatar from "@react-spectrum/s2/icons/UserAvatar";
import S2Icon_UserAvatarCursor from "@react-spectrum/s2/icons/UserAvatarCursor";
import S2Icon_UserEdit from "@react-spectrum/s2/icons/UserEdit";
import S2Icon_UserFollowing from "@react-spectrum/s2/icons/UserFollowing";
import S2Icon_UserGroup from "@react-spectrum/s2/icons/UserGroup";
import S2Icon_UserLock from "@react-spectrum/s2/icons/UserLock";
import S2Icon_UserSettings from "@react-spectrum/s2/icons/UserSettings";
import S2Icon_UsersLock from "@react-spectrum/s2/icons/UsersLock";
import S2Icon_VectorDraw from "@react-spectrum/s2/icons/VectorDraw";
import S2Icon_Video from "@react-spectrum/s2/icons/Video";
import S2Icon_ViewGrid from "@react-spectrum/s2/icons/ViewGrid";
import S2Icon_ViewGridFluid from "@react-spectrum/s2/icons/ViewGridFluid";
import S2Icon_ViewList from "@react-spectrum/s2/icons/ViewList";
import S2Icon_ViewTransparency from "@react-spectrum/s2/icons/ViewTransparency";
import S2Icon_Visibility from "@react-spectrum/s2/icons/Visibility";
import S2Icon_VisibilityOff from "@react-spectrum/s2/icons/VisibilityOff";
import S2Icon_VolumeOff from "@react-spectrum/s2/icons/VolumeOff";
import S2Icon_VolumeOne from "@react-spectrum/s2/icons/VolumeOne";
import S2Icon_VolumeTwo from "@react-spectrum/s2/icons/VolumeTwo";
import S2Icon_Wallet from "@react-spectrum/s2/icons/Wallet";
import S2Icon_WebNavBar from "@react-spectrum/s2/icons/WebNavBar";
import S2Icon_WebPage from "@react-spectrum/s2/icons/WebPage";
import S2Icon_ZoomFitToHeight from "@react-spectrum/s2/icons/ZoomFitToHeight";
import S2Icon_ZoomFitToScreen from "@react-spectrum/s2/icons/ZoomFitToScreen";
import S2Icon_ZoomFitToWidth from "@react-spectrum/s2/icons/ZoomFitToWidth";
import S2Icon_ZoomIn from "@react-spectrum/s2/icons/ZoomIn";
import S2Icon_ZoomOut from "@react-spectrum/s2/icons/ZoomOut";
import type { IconSpectrumProps, IconSpectrumName, IconSpectrumBaseProps } from "./IconSpectrum.types";

export const iconSpectrumMap: Record<IconSpectrumName, ComponentType<IconSpectrumBaseProps>> = {
  "3D": S2Icon_3D,
  "3DAsset": S2Icon_3DAsset,
  "3DMaterial": S2Icon_3DMaterial,
  "ABC": S2Icon_ABC,
  "Accessibility": S2Icon_Accessibility,
  "Add": S2Icon_Add,
  "AddCircle": S2Icon_AddCircle,
  "AddContent": S2Icon_AddContent,
  "AlertDiamond": S2Icon_AlertDiamond,
  "AlertTriangle": S2Icon_AlertTriangle,
  "AlignBottom": S2Icon_AlignBottom,
  "AlignCenter": S2Icon_AlignCenter,
  "AlignLeft": S2Icon_AlignLeft,
  "AlignMiddle": S2Icon_AlignMiddle,
  "AlignRight": S2Icon_AlignRight,
  "AlignTop": S2Icon_AlignTop,
  "Animation": S2Icon_Animation,
  "AnimationNo": S2Icon_AnimationNo,
  "App": S2Icon_App,
  "Apps": S2Icon_Apps,
  "AppsAll": S2Icon_AppsAll,
  "Archive": S2Icon_Archive,
  "ArrowCurved": S2Icon_ArrowCurved,
  "ArrowHeadTool": S2Icon_ArrowHeadTool,
  "ArrowUpSend": S2Icon_ArrowUpSend,
  "Artboard": S2Icon_Artboard,
  "AspectRatio": S2Icon_AspectRatio,
  "Asset": S2Icon_Asset,
  "Attach": S2Icon_Attach,
  "AudioWave": S2Icon_AudioWave,
  "AutoSelectSubject": S2Icon_AutoSelectSubject,
  "Background": S2Icon_Background,
  "BadgeVerified": S2Icon_BadgeVerified,
  "Bell": S2Icon_Bell,
  "BellRotated": S2Icon_BellRotated,
  "BetaApp": S2Icon_BetaApp,
  "Binoculars": S2Icon_Binoculars,
  "Blur": S2Icon_Blur,
  "Bookmark": S2Icon_Bookmark,
  "BookmarkSingleFilled": S2Icon_BookmarkSingleFilled,
  "Brand": S2Icon_Brand,
  "Briefcase": S2Icon_Briefcase,
  "BrightnessContrast": S2Icon_BrightnessContrast,
  "Brush": S2Icon_Brush,
  "Bug": S2Icon_Bug,
  "Building": S2Icon_Building,
  "Buildings": S2Icon_Buildings,
  "Calendar": S2Icon_Calendar,
  "CalendarAdd": S2Icon_CalendarAdd,
  "CalendarDay": S2Icon_CalendarDay,
  "CalendarEdit": S2Icon_CalendarEdit,
  "CalendarWeek": S2Icon_CalendarWeek,
  "CallCenter": S2Icon_CallCenter,
  "Camera": S2Icon_Camera,
  "CameraProperties": S2Icon_CameraProperties,
  "Cancel": S2Icon_Cancel,
  "CCLibrary": S2Icon_CCLibrary,
  "Channel": S2Icon_Channel,
  "ChartBarVert": S2Icon_ChartBarVert,
  "ChartPie": S2Icon_ChartPie,
  "ChartTrend": S2Icon_ChartTrend,
  "Chat": S2Icon_Chat,
  "CheckBox": S2Icon_CheckBox,
  "Checkmark": S2Icon_Checkmark,
  "CheckmarkCircle": S2Icon_CheckmarkCircle,
  "ChevronDoubleLeft": S2Icon_ChevronDoubleLeft,
  "ChevronDoubleRight": S2Icon_ChevronDoubleRight,
  "ChevronDown": S2Icon_ChevronDown,
  "ChevronLeft": S2Icon_ChevronLeft,
  "ChevronRight": S2Icon_ChevronRight,
  "ChevronUp": S2Icon_ChevronUp,
  "Circle": S2Icon_Circle,
  "Clock": S2Icon_Clock,
  "ClockPending": S2Icon_ClockPending,
  "Close": S2Icon_Close,
  "CloseCaptions": S2Icon_CloseCaptions,
  "CloseCircle": S2Icon_CloseCircle,
  "Cloud": S2Icon_Cloud,
  "CloudStateDisconnected": S2Icon_CloudStateDisconnected,
  "CloudStateError": S2Icon_CloudStateError,
  "CloudStateInProgress": S2Icon_CloudStateInProgress,
  "CloudStateOnline": S2Icon_CloudStateOnline,
  "CloudStatePaused": S2Icon_CloudStatePaused,
  "CloudStatePending": S2Icon_CloudStatePending,
  "CloudStateSlowConnection": S2Icon_CloudStateSlowConnection,
  "Code": S2Icon_Code,
  "Collection": S2Icon_Collection,
  "Color": S2Icon_Color,
  "ColorFill": S2Icon_ColorFill,
  "ColorHarmony": S2Icon_ColorHarmony,
  "Comment": S2Icon_Comment,
  "CommentCheckmark": S2Icon_CommentCheckmark,
  "CommentHide": S2Icon_CommentHide,
  "CommentRemove": S2Icon_CommentRemove,
  "CommentShow": S2Icon_CommentShow,
  "CommentText": S2Icon_CommentText,
  "Community": S2Icon_Community,
  "Compare": S2Icon_Compare,
  "ContextualTaskBar": S2Icon_ContextualTaskBar,
  "Contrast": S2Icon_Contrast,
  "Copy": S2Icon_Copy,
  "CornerRadius": S2Icon_CornerRadius,
  "CornerRadiusBottomLeft": S2Icon_CornerRadiusBottomLeft,
  "CornerRadiusBottomRight": S2Icon_CornerRadiusBottomRight,
  "CornerRadiusEach": S2Icon_CornerRadiusEach,
  "CornerRadiusTopLeft": S2Icon_CornerRadiusTopLeft,
  "CornerRadiusTopRight": S2Icon_CornerRadiusTopRight,
  "Crop": S2Icon_Crop,
  "CropRotate": S2Icon_CropRotate,
  "CursorClick": S2Icon_CursorClick,
  "Cut": S2Icon_Cut,
  "Data": S2Icon_Data,
  "DataAdd": S2Icon_DataAdd,
  "DataRefresh": S2Icon_DataRefresh,
  "DataSettings": S2Icon_DataSettings,
  "DataUpload": S2Icon_DataUpload,
  "Delete": S2Icon_Delete,
  "DeviceAll": S2Icon_DeviceAll,
  "DeviceDesktop": S2Icon_DeviceDesktop,
  "DeviceDesktopMobile": S2Icon_DeviceDesktopMobile,
  "DeviceLaptop": S2Icon_DeviceLaptop,
  "DeviceMobile": S2Icon_DeviceMobile,
  "DeviceMultiscreen": S2Icon_DeviceMultiscreen,
  "DevicePhone": S2Icon_DevicePhone,
  "DeviceTablet": S2Icon_DeviceTablet,
  "DirectSelect": S2Icon_DirectSelect,
  "Discover": S2Icon_Discover,
  "DistributeBottomEdge": S2Icon_DistributeBottomEdge,
  "DistributeHorizontalCenter": S2Icon_DistributeHorizontalCenter,
  "DistributeLeftEdge": S2Icon_DistributeLeftEdge,
  "DistributeRightEdge": S2Icon_DistributeRightEdge,
  "DistributeSpaceHorizontally": S2Icon_DistributeSpaceHorizontally,
  "DistributeSpaceVertically": S2Icon_DistributeSpaceVertically,
  "DistributeTopEdge": S2Icon_DistributeTopEdge,
  "DistributeVerticalCenter": S2Icon_DistributeVerticalCenter,
  "Download": S2Icon_Download,
  "Draw": S2Icon_Draw,
  "Duplicate": S2Icon_Duplicate,
  "Edit": S2Icon_Edit,
  "EditNo": S2Icon_EditNo,
  "Education": S2Icon_Education,
  "EffectBorder": S2Icon_EffectBorder,
  "Effects": S2Icon_Effects,
  "Email": S2Icon_Email,
  "Emoji": S2Icon_Emoji,
  "Enterprise": S2Icon_Enterprise,
  "Erase": S2Icon_Erase,
  "Export": S2Icon_Export,
  "ExportTo": S2Icon_ExportTo,
  "Exposure": S2Icon_Exposure,
  "Eyedropper": S2Icon_Eyedropper,
  "Feedback": S2Icon_Feedback,
  "File": S2Icon_File,
  "FileAdd": S2Icon_FileAdd,
  "FileConvert": S2Icon_FileConvert,
  "Files": S2Icon_Files,
  "FileText": S2Icon_FileText,
  "FileUser": S2Icon_FileUser,
  "Filmstrip": S2Icon_Filmstrip,
  "Filter": S2Icon_Filter,
  "Filters": S2Icon_Filters,
  "FindAndReplace": S2Icon_FindAndReplace,
  "Flag": S2Icon_Flag,
  "FlipHorizontal": S2Icon_FlipHorizontal,
  "FlipVertical": S2Icon_FlipVertical,
  "Folder": S2Icon_Folder,
  "FolderAdd": S2Icon_FolderAdd,
  "FolderBreadcrumb": S2Icon_FolderBreadcrumb,
  "FolderClock": S2Icon_FolderClock,
  "FolderMoveTo": S2Icon_FolderMoveTo,
  "FolderOpen": S2Icon_FolderOpen,
  "FolderSearch": S2Icon_FolderSearch,
  "FontPicker": S2Icon_FontPicker,
  "FullScreen": S2Icon_FullScreen,
  "FullScreenExit": S2Icon_FullScreenExit,
  "Gift": S2Icon_Gift,
  "GlobeGrid": S2Icon_GlobeGrid,
  "Gradient": S2Icon_Gradient,
  "GradientHorizontal": S2Icon_GradientHorizontal,
  "GradientRadial": S2Icon_GradientRadial,
  "GridsAndRulers": S2Icon_GridsAndRulers,
  "GridTypeDots": S2Icon_GridTypeDots,
  "GridTypeLines": S2Icon_GridTypeLines,
  "Group": S2Icon_Group,
  "GroupNo": S2Icon_GroupNo,
  "Hand": S2Icon_Hand,
  "Heart": S2Icon_Heart,
  "HeartFilled": S2Icon_HeartFilled,
  "HelpCircle": S2Icon_HelpCircle,
  "History": S2Icon_History,
  "Home": S2Icon_Home,
  "Image": S2Icon_Image,
  "ImageAdd": S2Icon_ImageAdd,
  "ImageBackgroundRemove": S2Icon_ImageBackgroundRemove,
  "Images": S2Icon_Images,
  "Import": S2Icon_Import,
  "InfoCircle": S2Icon_InfoCircle,
  "Interaction": S2Icon_Interaction,
  "Invert": S2Icon_Invert,
  "Invite": S2Icon_Invite,
  "Key": S2Icon_Key,
  "Keyboard": S2Icon_Keyboard,
  "LassoSelect": S2Icon_LassoSelect,
  "Layers": S2Icon_Layers,
  "Layout": S2Icon_Layout,
  "Leave": S2Icon_Leave,
  "Lightbulb": S2Icon_Lightbulb,
  "Lighten": S2Icon_Lighten,
  "Line": S2Icon_Line,
  "LineHeight": S2Icon_LineHeight,
  "Link": S2Icon_Link,
  "LinkVertical": S2Icon_LinkVertical,
  "ListBulleted": S2Icon_ListBulleted,
  "ListMultiSelect": S2Icon_ListMultiSelect,
  "ListNumbered": S2Icon_ListNumbered,
  "Location": S2Icon_Location,
  "Lock": S2Icon_Lock,
  "LockOpen": S2Icon_LockOpen,
  "Logo": S2Icon_Logo,
  "MagicWand": S2Icon_MagicWand,
  "Market": S2Icon_Market,
  "Mask": S2Icon_Mask,
  "MaskDisable": S2Icon_MaskDisable,
  "Maximize": S2Icon_Maximize,
  "MediaOffline": S2Icon_MediaOffline,
  "Mention": S2Icon_Mention,
  "MenuHamburger": S2Icon_MenuHamburger,
  "Microphone": S2Icon_Microphone,
  "MicrophoneOff": S2Icon_MicrophoneOff,
  "Minimize": S2Icon_Minimize,
  "More": S2Icon_More,
  "Move": S2Icon_Move,
  "MovieCamera": S2Icon_MovieCamera,
  "MusicNote": S2Icon_MusicNote,
  "NamingOrder": S2Icon_NamingOrder,
  "New": S2Icon_New,
  "Nudge": S2Icon_Nudge,
  "OpenIn": S2Icon_OpenIn,
  "Order": S2Icon_Order,
  "OrderBottom": S2Icon_OrderBottom,
  "OrderOneDown": S2Icon_OrderOneDown,
  "OrderOneUp": S2Icon_OrderOneUp,
  "OrderTop": S2Icon_OrderTop,
  "OrientationLandscape": S2Icon_OrientationLandscape,
  "OrientationPortrait": S2Icon_OrientationPortrait,
  "Paste": S2Icon_Paste,
  "Path": S2Icon_Path,
  "Pattern": S2Icon_Pattern,
  "Pause": S2Icon_Pause,
  "PauseCircle": S2Icon_PauseCircle,
  "PenBrush": S2Icon_PenBrush,
  "People": S2Icon_People,
  "PeopleGroup": S2Icon_PeopleGroup,
  "Percentage": S2Icon_Percentage,
  "PinOff": S2Icon_PinOff,
  "PinOn": S2Icon_PinOn,
  "Play": S2Icon_Play,
  "Plugin": S2Icon_Plugin,
  "PluginGear": S2Icon_PluginGear,
  "Polygon3": S2Icon_Polygon3,
  "Polygon4": S2Icon_Polygon4,
  "Polygon5": S2Icon_Polygon5,
  "Polygon6": S2Icon_Polygon6,
  "PremiumIcon": S2Icon_PremiumIcon,
  "Preview": S2Icon_Preview,
  "Print": S2Icon_Print,
  "Project": S2Icon_Project,
  "ProjectAddInto": S2Icon_ProjectAddInto,
  "ProjectCreate": S2Icon_ProjectCreate,
  "Promote": S2Icon_Promote,
  "Prompt": S2Icon_Prompt,
  "Properties": S2Icon_Properties,
  "Prototyping": S2Icon_Prototyping,
  "Publish": S2Icon_Publish,
  "PublishNo": S2Icon_PublishNo,
  "RadioButton": S2Icon_RadioButton,
  "RectangleHoriz": S2Icon_RectangleHoriz,
  "Redo": S2Icon_Redo,
  "Refresh": S2Icon_Refresh,
  "RemoveCircle": S2Icon_RemoveCircle,
  "Rename": S2Icon_Rename,
  "Replace": S2Icon_Replace,
  "ReportAbuse": S2Icon_ReportAbuse,
  "Resize": S2Icon_Resize,
  "Revert": S2Icon_Revert,
  "ReviewLink": S2Icon_ReviewLink,
  "Ribbon": S2Icon_Ribbon,
  "RocketQuickActions": S2Icon_RocketQuickActions,
  "RotateCCW": S2Icon_RotateCCW,
  "RotateCW": S2Icon_RotateCW,
  "RotateOrientation": S2Icon_RotateOrientation,
  "Ruler": S2Icon_Ruler,
  "Saturation": S2Icon_Saturation,
  "SaveFloppy": S2Icon_SaveFloppy,
  "Search": S2Icon_Search,
  "Select": S2Icon_Select,
  "SelectAllItems": S2Icon_SelectAllItems,
  "SelectAndMove": S2Icon_SelectAndMove,
  "SelectMulti": S2Icon_SelectMulti,
  "SelectNo": S2Icon_SelectNo,
  "SelectNone": S2Icon_SelectNone,
  "SelectRectangle": S2Icon_SelectRectangle,
  "Send": S2Icon_Send,
  "Settings": S2Icon_Settings,
  "Shapes": S2Icon_Shapes,
  "Share": S2Icon_Share,
  "ShareAndroid": S2Icon_ShareAndroid,
  "ShoppingCart": S2Icon_ShoppingCart,
  "Shuffle": S2Icon_Shuffle,
  "Similar": S2Icon_Similar,
  "Slideshow": S2Icon_Slideshow,
  "SlowConnectionCircle": S2Icon_SlowConnectionCircle,
  "SocialNetwork": S2Icon_SocialNetwork,
  "Sort": S2Icon_Sort,
  "SortDown": S2Icon_SortDown,
  "SortUp": S2Icon_SortUp,
  "SpeedFast": S2Icon_SpeedFast,
  "StampClone": S2Icon_StampClone,
  "Star": S2Icon_Star,
  "StarFilled": S2Icon_StarFilled,
  "StepBackward": S2Icon_StepBackward,
  "StepForward": S2Icon_StepForward,
  "StickyNote": S2Icon_StickyNote,
  "StopProcessing": S2Icon_StopProcessing,
  "StrokeDotted": S2Icon_StrokeDotted,
  "StrokeSolid": S2Icon_StrokeSolid,
  "StrokeWidth": S2Icon_StrokeWidth,
  "Switch": S2Icon_Switch,
  "SwitchVertical": S2Icon_SwitchVertical,
  "Table": S2Icon_Table,
  "Tag": S2Icon_Tag,
  "TagBold": S2Icon_TagBold,
  "TagItalic": S2Icon_TagItalic,
  "TagStrikeThrough": S2Icon_TagStrikeThrough,
  "TagUnderline": S2Icon_TagUnderline,
  "Target": S2Icon_Target,
  "Temperature": S2Icon_Temperature,
  "Template": S2Icon_Template,
  "Text": S2Icon_Text,
  "TextAdd": S2Icon_TextAdd,
  "TextAlignCenter": S2Icon_TextAlignCenter,
  "TextAlignJustify": S2Icon_TextAlignJustify,
  "TextAlignJustifyLastCenter": S2Icon_TextAlignJustifyLastCenter,
  "TextAlignJustifyLastLeft": S2Icon_TextAlignJustifyLastLeft,
  "TextAlignJustifyLastRight": S2Icon_TextAlignJustifyLastRight,
  "TextAlignLeft": S2Icon_TextAlignLeft,
  "TextAlignRight": S2Icon_TextAlignRight,
  "TextBold": S2Icon_TextBold,
  "TextCapsAll": S2Icon_TextCapsAll,
  "TextCapsSmall": S2Icon_TextCapsSmall,
  "TextHighlight": S2Icon_TextHighlight,
  "TextIncrease": S2Icon_TextIncrease,
  "TextItalic": S2Icon_TextItalic,
  "TextNumbers": S2Icon_TextNumbers,
  "TextParagraph": S2Icon_TextParagraph,
  "TextReplaceComment": S2Icon_TextReplaceComment,
  "TextSize": S2Icon_TextSize,
  "TextStrikeThrough": S2Icon_TextStrikeThrough,
  "TextSubscript": S2Icon_TextSubscript,
  "TextSuperscript": S2Icon_TextSuperscript,
  "TextUnderline": S2Icon_TextUnderline,
  "TextVariableFontSettings": S2Icon_TextVariableFontSettings,
  "ThumbDown": S2Icon_ThumbDown,
  "ThumbUp": S2Icon_ThumbUp,
  "Toggle": S2Icon_Toggle,
  "Tools": S2Icon_Tools,
  "TouchOneFingerSwipeLeftRight": S2Icon_TouchOneFingerSwipeLeftRight,
  "Transcript": S2Icon_Transcript,
  "TransformDistort": S2Icon_TransformDistort,
  "TransformGeneric": S2Icon_TransformGeneric,
  "TransformPerspective": S2Icon_TransformPerspective,
  "TransformSkew": S2Icon_TransformSkew,
  "TransformWarp": S2Icon_TransformWarp,
  "Translate": S2Icon_Translate,
  "Tutorials": S2Icon_Tutorials,
  "Undo": S2Icon_Undo,
  "UnLink": S2Icon_UnLink,
  "UnlinkHoriz": S2Icon_UnlinkHoriz,
  "UnlinkVertical": S2Icon_UnlinkVertical,
  "Upload": S2Icon_Upload,
  "UploadToCloud": S2Icon_UploadToCloud,
  "User": S2Icon_User,
  "UserAdd": S2Icon_UserAdd,
  "UserAvatar": S2Icon_UserAvatar,
  "UserAvatarCursor": S2Icon_UserAvatarCursor,
  "UserEdit": S2Icon_UserEdit,
  "UserFollowing": S2Icon_UserFollowing,
  "UserGroup": S2Icon_UserGroup,
  "UserLock": S2Icon_UserLock,
  "UserSettings": S2Icon_UserSettings,
  "UsersLock": S2Icon_UsersLock,
  "VectorDraw": S2Icon_VectorDraw,
  "Video": S2Icon_Video,
  "ViewGrid": S2Icon_ViewGrid,
  "ViewGridFluid": S2Icon_ViewGridFluid,
  "ViewList": S2Icon_ViewList,
  "ViewTransparency": S2Icon_ViewTransparency,
  "Visibility": S2Icon_Visibility,
  "VisibilityOff": S2Icon_VisibilityOff,
  "VolumeOff": S2Icon_VolumeOff,
  "VolumeOne": S2Icon_VolumeOne,
  "VolumeTwo": S2Icon_VolumeTwo,
  "Wallet": S2Icon_Wallet,
  "WebNavBar": S2Icon_WebNavBar,
  "WebPage": S2Icon_WebPage,
  "ZoomFitToHeight": S2Icon_ZoomFitToHeight,
  "ZoomFitToScreen": S2Icon_ZoomFitToScreen,
  "ZoomFitToWidth": S2Icon_ZoomFitToWidth,
  "ZoomIn": S2Icon_ZoomIn,
  "ZoomOut": S2Icon_ZoomOut,
};

export function IconSpectrum({ name, ...props }: IconSpectrumProps) {
  const Component = iconSpectrumMap[name];
  if (!Component) return null;
  return <Component {...props} />;
}
